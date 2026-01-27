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

export interface SearchArtist {
    id: string;
    name: string;
    image: { url: string; width: number; height: number } | null;
    followers: number;
    genres: string[];
    popularity: number;
}

export interface SearchAlbum {
    id: string;
    name: string;
    image: { url: string; width: number; height: number };
    release_date: string;
    total_tracks: number;
    album_type: "album" | "single" | "compilation";
    artists: { id: string; name: string }[];
}

export interface SimplifiedAlbum {
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
    artists: {
        id: string;
        name: string;
        type: "artist";
        uri: string;
        href: string;
        external_urls: {
            spotify: string;
        };
    }[];
}

export interface SpotifySearchResponse {
    artists?: {
        items: SpotifyArtist[];
        limit: number;
        offset: number;
        total: number;
        next: string | null;
        previous: string | null;
        href: string;
    };
    albums?: {
        items: SimplifiedAlbum[];
        limit: number;
        offset: number;
        total: number;
        next: string | null;
        previous: string | null;
        href: string;
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
