import { AlbumDB } from "@/types/convex";
import { Album } from "../musicbrainz/musicbrainz";

export function albumDbToAlbum(db: AlbumDB): Album {
    return {
        id: db.releaseGroupId,
        title: db.title,
        year: db.year ?? null,
        coverArt: db.coverArt ?? null,
        albumArtists: db.albumArtists,
        genres: db.genres,
        tracks: db.tracks.map(track => ({
            disc: track.disc,
            position: track.position,
            title: track.title,
            durationMs: track.durationMs ?? null,
            artists: track.artists,
        })),
    };
}