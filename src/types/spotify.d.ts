export interface SpotifyArtist {
    id: string;
    name: string;
    type: "artist";
    uri: string;
    href: string;
    external_urls: {
        spotify: string;
    };
    genres: string[];
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    popularity: number; // 0–100
    followers: {
        total: number;
        href: string | null; // always null in practice
    };
}

export interface SpotifyAlbum {
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    release_date: string; // e.g. "2020-03-20"
    release_date_precision: "year" | "month" | "day";
    type: "album";
    uri: string;
    artists: SpotifyArtist[];
}

export interface SpotifySearchResponse {
    artists?: {
        href: string;
        items: SpotifyArtist[];
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
    };
    albums?: {
        href: string;
        items: SpotifyAlbum[];
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
    };
    // tracks, playlists, etc. can also be included
}
