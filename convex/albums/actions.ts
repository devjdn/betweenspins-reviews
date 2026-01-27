import { action } from "../_generated/server";
import { v } from "convex/values";
import { MusicBrainzClient } from "@/lib/musicbrainz/musicbrainz";
import { api, internal } from "../_generated/api";

type IngestedAlbum = {
    releaseGroupId: string;
    title: string;
    albumArtists: { id: string; name: string }[];
    tracks: {
        disc: number;
        position: number;
        title: string;
        durationMs?: number;
        artists: { id: string; name: string }[];
    }[];
    year?: number;
    isCompilation: boolean;
    coverArt?: {
        full: string;
        thumbnail: string;
    };
    genres: string[];
};

const mb = new MusicBrainzClient();

export const ingestFromMusicBrainz = action({
    args: {
        releaseGroupId: v.string(),
    },

    handler: async (
        ctx,
        { releaseGroupId }
    ): Promise<IngestedAlbum> => {
        const existing = await ctx.runQuery(
            api.albums.queries.getByReleaseGroupId,
            { releaseGroupId }
        );

        if (existing) {
            return existing;
        }

        const mbAlbum = await mb.getAlbumByReleaseGroupId(
            releaseGroupId
        );

        if (!mbAlbum.coverArt) {
            throw new Error(
                `Missing cover art for releaseGroupId=${releaseGroupId}`
            );
        }

        if (!mbAlbum.tracks.length) {
            throw new Error(
                `Missing tracklist for releaseGroupId=${releaseGroupId}`
            );
        }


        // Normalize to Convex shape
        const album: IngestedAlbum = {
            releaseGroupId: mbAlbum.id,
            title: mbAlbum.title,
            year: mbAlbum.year ?? undefined,
            coverArt: mbAlbum.coverArt,
            genres: mbAlbum.genres ?? [],

            albumArtists: mbAlbum.albumArtists.map(a => ({
                id: a.id,
                name: a.name,
            })),

            isCompilation: false,

            tracks: mbAlbum.tracks.map(track => ({
                disc: track.disc,
                position: track.position,
                title: track.title,
                durationMs: track.durationMs ?? undefined,
                artists: track.artists.map(a => ({
                    id: a.id,
                    name: a.name,
                })),
            })),
        };

        await ctx.runMutation(
            internal.albums.mutations.upsertAlbumWithArtists,
            { album }
        );

        return album;
    },
});
