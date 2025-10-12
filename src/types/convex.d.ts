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
