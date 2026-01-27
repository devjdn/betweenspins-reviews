import type {
    MBReleaseGroup,
    MBReleaseSearchResult,
    MBFullRelease,
    MBRelease,
    MBArtistCredit,
    CAReleaseResponse,
} from "@/types/musicbrainz";
import { getAverageColor } from "fast-average-color-node";

const MB_BASE = "https://musicbrainz.org/ws/2";
const CAA_BASE = "https://coverartarchive.org";
const USER_AGENT = "BetweenSpins/0.1.0 (jaydenux@outlook.com)";

export interface Album {
    id: string; // release-group ID
    title: string;
    albumArtists: {
        id: string;
        name: string;
        joinPhrase?: string;
    }[];
    year: number | null;
    coverArt: {
        full: string;
        thumbnail: string;
        // averageColor: string;
    } | null;
    tracks: {
        disc: number;
        position: number;
        title: string;
        durationMs: number | null;
        artists: {
            id: string;
            name: string;
            joinPhrase?: string;
        }[];
    }[];
    genres: string[];
}

export class MusicBrainzClient {
    private async fetchJSON<T>(url: string): Promise<T> {
        const res = await fetch(url, {
            headers: {
                "User-Agent": USER_AGENT,
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        return res.json() as Promise<T>;
    }

    private mapArtistCredits(
        credits: MBArtistCredit[]
    ): Album["albumArtists"] {
        return credits.map(ac => ({
            id: ac.artist.id,
            name: ac.artist.name,
            joinPhrase: ac.joinphrase || undefined,
        }));
    }

    async getAlbumByReleaseGroupId(
        releaseGroupId: string
    ): Promise<Album> {
        const rg = await this.fetchJSON<MBReleaseGroup>(
            `${MB_BASE}/release-group/${releaseGroupId}?inc=artists+genres&fmt=json`
        );

        const releaseRes = await this.fetchJSON<MBReleaseSearchResult>(
            `${MB_BASE}/release?release-group=${releaseGroupId}&status=official&inc=media&limit=25&fmt=json`
        );

        const releases = releaseRes.releases ?? [];
        if (!releases.length) {
            throw new Error("No releases found");
        }

        const originalRelease = this.pickOriginalRelease(releases);
        if (!originalRelease) {
            throw new Error("No original release found");
        }

        const rankedForCover =
            this.rankReleasesForCoverArt(releases);

        const coverArt = await this.resolveCoverArt(
            rankedForCover
        );

        const fullOriginalRelease =
            await this.fetchJSON<MBFullRelease>(
                `${MB_BASE}/release/${originalRelease.id}?inc=recordings&fmt=json`
            );

        const albumArtists = this.mapArtistCredits(
            rg["artist-credit"]
        );

        const tracks = this.extractTracksFromRelease(
            fullOriginalRelease,
            albumArtists
        );

        if (!tracks.length) {
            throw new Error("Empty tracklist");
        }

        return {
            id: rg.id,
            title: rg.title,
            albumArtists,
            year: rg["first-release-date"]
                ? Number(rg["first-release-date"].slice(0, 4))
                : null,
            coverArt,
            tracks,
            genres: rg.genres?.map(g => g.name) ?? [],
        };
    }

    private rankReleasesForCoverArt(
        releases: MBRelease[]
    ): MBRelease[] {
        return releases
            .map(r => {
                let score = 0;
                const formats =
                    r.media?.map(m =>
                        m.format?.toLowerCase()
                    ) ?? [];

                if (formats.includes("digital media")) score += 3;
                if (formats.includes("cd")) score += 2;
                if (formats.includes("vinyl")) score += 1;

                const title = (r.title ?? "").toLowerCase();
                if (title.includes("remaster")) score += 1;
                if (title.includes("deluxe")) score += 1;

                return { r, score };
            })
            .sort((a, b) => b.score - a.score)
            .map(x => x.r);
    }

    private async resolveCoverArt(
        releases: MBRelease[]
    ): Promise<Album["coverArt"]> {
        for (const release of releases) {
            try {
                const data = await this.fetchJSON<CAReleaseResponse>(
                    `${CAA_BASE}/release/${release.id}`
                );

                const hasFront = data.images.some(
                    img => img.front && img.approved !== false
                );

                if (!hasFront) continue;

                const thumbnail = `${CAA_BASE}/release/${release.id}/front-250`;
                const full = `${CAA_BASE}/release/${release.id}/front`;

                // let averageColor = "#000000"; // safe fallback

                // try {
                //     const result = await getAverageColor(thumbnail);
                //     averageColor = result.hex; // hex is usually nicer than rgb
                // } catch {
                //     // expected sometimes (CAA hiccups, fetch aborts, etc)
                // }

                return {
                    full,
                    thumbnail,
                    // averageColor,
                };
            } catch {
                // no cover art for this release — keep trying
            }
        }

        throw new Error("No usable cover art found");
    }


    private pickOriginalRelease(
        releases: MBRelease[]
    ): MBRelease | null {
        return (
            releases
                .filter(r => r.date)
                .sort(
                    (a, b) =>
                        new Date(a.date!).getTime() -
                        new Date(b.date!).getTime()
                )[0] ?? null
        );
    }

    private extractTracksFromRelease(
        release: MBFullRelease,
        albumArtists: Album["albumArtists"]
    ): Album["tracks"] {
        if (!release.media) return [];

        return release.media.flatMap(medium =>
            medium.tracks.map(track => ({
                disc: medium.position,
                position: track.position ?? 0,
                title: track.title,
                durationMs: track.length ?? null,
                artists:
                    track["artist-credit"]?.length
                        ? this.mapArtistCredits(
                            track["artist-credit"]
                        )
                        : albumArtists,
            }))
        );
    }
}
