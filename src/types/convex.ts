import { Id } from "../../convex/_generated/dataModel";

export interface AlbumReview {
    _id: string;
    userId: string;
    spotifyAlbumId: string;
    albumTitle: string;
    albumArtists: string[];
    reviewTitle?: string;
    rating: number;
    review?: string;
}

export interface AlbumRating {
    _id: string;
    spotifyAlbumId: string;
    albumTitle: string;
    averageRating: number;
    totalRatings: number;
}

export interface AlbumDB {
    _id: Id<"albums">;
    _creationTime: number;
    releaseGroupId: string;
    title: string;
    year?: number;
    genres: string[];
    coverArt?: {
        full: string;
        thumbnail: string;
    };
    albumArtists: {
        id: string;
        name: string;
    }[];
    tracks: {
        disc: number;
        position: number;
        title: string;
        durationMs?: number;
        artists: {
            id: string;
            name: string;
        }[];
    }[];
    isCompilation: boolean;
    createdAt: number;
}
