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
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    type: "album";
    uri: string;
    artists: SpotifyArtist[];
    tracks: SpotifyAlbumTracks;
    copyrights: {
        text: string;
        type: "C" | "P";
    }[];
    external_ids?: {
        isrc?: string;
        ean?: string;
        upc?: string;
    };
    popularity: number;
    label: string;
    restrictions?: {
        reason: "market" | "product" | "explicit";
    };
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
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    href: string;
    is_playable?: boolean;
    linked_from?: {
        id: string;
        href: string;
        uri: string;
    };
    preview_url: string | null;
    track_number: number;
    type: "track";
    uri: string;
}

export interface SpotifyAlbumTracks {
    href: string;
    items: SpotifyTrack[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}
