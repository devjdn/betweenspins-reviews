export interface MBArtist {
    id: string;
    name: string;
    "sort-name"?: string;
    disambiguation?: string;
}

export interface MBArtistCredit {
    artist: MBArtist;
    joinphrase?: string;
}

export interface MBTag {
    name: string;
    count: number;
}

export interface MBReleaseGroup {
    id: string;
    title: string;
    "first-release-date"?: string;
    "artist-credit": MBArtistCredit[];

    genres?: Array<{
        id: string;
        name: string;
        "disambiguation"?: string;
        count?: number; // sometimes present
    }>;

    tags?: Array<{
        name: string;
        count?: number;
    }>;
}


export interface MBMedium {
    position: number;
    format?: string;
    tracks?: MBTrack[];
}

export type MBReleaseStatus =
    | "Official"
    | "Promotion"
    | "Bootleg"
    | "Pseudo-Release";

export interface MBRelease {
    id: string;
    title: string;
    status?: MBReleaseStatus;
    date?: string;
    country?: string;
    media?: MBMedium[];
}

export interface MBReleaseSearchResult {
    releases: MBRelease[];
}

export interface MBTrack {
    position?: number;
    title: string;
    length?: number;
    recording?: {
        id: string;
    };
    "artist-credit"?: MBArtistCredit[];
}


export interface MBFullRelease extends MBRelease {
    media: (MBMedium & {
        tracks: MBTrack[];
    })[];
}

export interface CAImage {
    front?: boolean;
    approved?: boolean;
    comment?: string;
    image: string;
    thumbnails?: {
        small?: string;
        large?: string;
    };
}

export interface CAReleaseResponse {
    images: CAImage[];
}
