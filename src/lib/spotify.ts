/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    SpotifyArtist,
    SpotifyAlbum,
    SpotifySearchResponse,
    SpotifyAlbumTracks,
} from "@/types/spotify";

export function formatFollowers(count: number) {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
}

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export type SimplifiedArtist = {
    id: string;
    name: string;
    image: { url: string; width: number; height: number } | null;
    followers: number;
    genres: string[];
    popularity: number;
};

export type SimplifiedAlbum = {
    id: string;
    name: string;
    image: { url: string; width: number; height: number } | null;
    release_date: string;
    total_tracks: number;
    album_type: string;
    artists: { id: string; name: string }[];
};

export class SpotifyAPI {
    private static cachedToken: string | null = null;
    private static tokenExpiry: number | null = null;
    private static readonly BASE_URL = "https://api.spotify.com/v1";

    /**
     * Get a valid access token for Spotify API calls
     */
    private static async getToken(): Promise<string> {
        const now = Date.now();

        // Return cached token if valid
        if (this.cachedToken && this.tokenExpiry && now < this.tokenExpiry) {
            return this.cachedToken;
        }

        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

        if (!clientId || !clientSecret) {
            throw new Error("Spotify credentials not configured");
        }

        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
            "base64"
        );

        const res = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Spotify token fetch failed:", res.status, errorText);
            throw new Error("Failed to fetch Spotify token");
        }

        const data: SpotifyTokenResponse = await res.json();

        this.cachedToken = data.access_token;
        this.tokenExpiry = now + (data.expires_in - 120) * 1000; // 2 min buffer before refreshing the token

        return this.cachedToken;
    }

    /**
     * Make authenticated request to Spotify API
     */
    private static async makeRequest<T>(endpoint: string): Promise<T> {
        let token = await this.getToken();
        const url = `${this.BASE_URL}${endpoint}`;

        let res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (res.status === 401) {
            // Force refresh token and retry once
            this.cachedToken = null;
            token = await this.getToken();

            res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
        }

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Spotify API error (${res.status}):`, errorText);
            throw new Error(`Spotify API request failed: ${res.status}`);
        }

        return res.json();
    }

    /**
     * Search for artists
     */
    static async searchArtists(
        query: string,
        limit: number = 10
    ): Promise<SimplifiedArtist[]> {
        if (!query.trim()) return [];

        const encodedQuery = encodeURIComponent(query);
        const data = await this.makeRequest<SpotifySearchResponse>(
            `/search?q=${encodedQuery}&type=artist&limit=${limit}`
        );

        return (
            data.artists?.items.map((artist) => ({
                id: artist.id,
                name: artist.name,
                image: artist.images?.at(-2) ?? null,
                followers: artist.followers.total,
                genres: artist.genres,
                popularity: artist.popularity,
            })) ?? []
        );
    }

    /**
     * Get multiple artists by their IDs (up to 50 at a time)
     */
    static async getArtists(artistIds: string[]): Promise<SpotifyArtist[]> {
        if (artistIds.length === 0) return [];
        if (artistIds.length > 50) {
            throw new Error("Cannot fetch more than 50 artists at once");
        }

        const ids = artistIds.join(",");
        const data = await this.makeRequest<{ artists: SpotifyArtist[] }>(
            `/artists?ids=${ids}`
        );

        return data.artists.filter((artist) => artist !== null); // Filter out null results
    }

    /**
     * Get a single artist by ID
     */
    static async getArtist(artistId: string): Promise<SpotifyArtist> {
        return this.makeRequest<SpotifyArtist>(`/artists/${artistId}`);
    }

    /**
     * Get artist's albums
     */
    static async getArtistAlbums(
        artistId: string,
        options: {
            include_groups?: string;
            limit?: number;
            offset?: number;
            market?: string;
        } = {}
    ): Promise<SimplifiedAlbum[]> {
        const params = new URLSearchParams();

        if (options.include_groups)
            params.set("include_groups", options.include_groups);
        if (options.limit) params.set("limit", options.limit.toString());
        if (options.offset) params.set("offset", options.offset.toString());
        if (options.market) params.set("market", options.market);

        const queryString = params.toString();
        const endpoint = `/artists/${artistId}/albums${
            queryString ? `?${queryString}` : ""
        }`;

        const data = await this.makeRequest<{ items: SpotifyAlbum[] }>(
            endpoint
        );

        return data.items.map((album) => ({
            id: album.id,
            name: album.name,
            image: album.images?.at(-2) ?? null,
            release_date: album.release_date,
            total_tracks: album.total_tracks,
            album_type: album.album_type,
            artists: album.artists.map((artist) => ({
                id: artist.id,
                name: artist.name,
            })),
        }));
    }

    /**
     * Get artist's top tracks
     */
    static async getArtistTopTracks(artistId: string, market: string = "US") {
        const data = await this.makeRequest<{ tracks: any[] }>(
            `/artists/${artistId}/top-tracks?market=${market}`
        );
        return data.tracks;
    }

    /**
     * Get artist's related artists
     */
    static async getRelatedArtists(
        artistId: string
    ): Promise<SimplifiedArtist[]> {
        const data = await this.makeRequest<{ artists: SpotifyArtist[] }>(
            `/artists/${artistId}/related-artists`
        );

        return data.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images?.at(-2) ?? null,
            followers: artist.followers.total,
            genres: artist.genres,
            popularity: artist.popularity,
        }));
    }

    /**
     * Search for albums
     */
    static async searchAlbums(
        query: string,
        limit: number = 10
    ): Promise<SimplifiedAlbum[]> {
        if (!query.trim()) return [];

        const encodedQuery = encodeURIComponent(query);
        const data = await this.makeRequest<SpotifySearchResponse>(
            `/search?q=${encodedQuery}&type=album&limit=${limit}`
        );

        return (
            data.albums?.items.map((album) => ({
                id: album.id,
                name: album.name,
                image: album.images?.at(-2) ?? null,
                release_date: album.release_date,
                total_tracks: album.total_tracks,
                album_type: album.album_type,
                artists: album.artists.map((artist) => ({
                    id: artist.id,
                    name: artist.name,
                })),
            })) ?? []
        );
    }

    /**
     * Search across both artists and albums
     */
    static async searchArtistsAndAlbums(
        query: string,
        limit: number = 10
    ): Promise<SpotifySearchResponse> {
        if (!query.trim()) {
            return {};
        }

        const encodedQuery = encodeURIComponent(query);
        const data = await this.makeRequest<SpotifySearchResponse>(
            `/search?q=${encodedQuery}&type=artist,album&limit=${limit}`
        );

        // Return the Spotify response directly — no mapping or restructuring
        return data;
    }

    /**
     * Get multiple tracks by their IDs (up to 50 at a time)
     */
    static async getTracks(trackIds: string[]) {
        if (trackIds.length === 0) return [];
        if (trackIds.length > 50) {
            throw new Error("Cannot fetch more than 50 tracks at once");
        }

        const ids = trackIds.join(",");
        const data = await this.makeRequest<{ tracks: any[] }>(
            `/tracks?ids=${ids}`
        );

        return data.tracks.filter((track) => track !== null);
    }

    /**
     * Get a single track by ID
     */
    static async getTrack(trackId: string) {
        return this.makeRequest(`/tracks/${trackId}`);
    }

    /**
     * Get multiple albums by their IDs (up to 20 at a time)
     */
    static async getAlbums(albumIds: string[]): Promise<SpotifyAlbum[]> {
        if (albumIds.length === 0) return [];
        if (albumIds.length > 20) {
            throw new Error("Cannot fetch more than 20 albums at once");
        }

        const ids = albumIds.join(",");
        const data = await this.makeRequest<{ albums: SpotifyAlbum[] }>(
            `/albums?ids=${ids}`
        );

        return data.albums.filter((album) => album !== null);
    }

    /**
     * Get a single album by ID
     */
    static async getAlbum(albumId: string): Promise<SpotifyAlbum> {
        return this.makeRequest<SpotifyAlbum>(`/albums/${albumId}`);
    }

    /**
     * Get album's tracks
     */
    static async getAlbumTracks(
        albumId: string,
        limit: number = 50,
        offset: number = 0
    ) {
        const data = await this.makeRequest<SpotifyAlbumTracks>(
            `/albums/${albumId}/tracks?limit=${limit}&offset=${offset}`
        );

        return data;
    }
}
