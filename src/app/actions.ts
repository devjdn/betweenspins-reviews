"use server";

import { SpotifyAPI } from "@/lib/spotify";
import { SpotifyArtist } from "@/types/spotify";
import { api } from "../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getSpotifyToken(): Promise<string> {
    const now = Date.now();

    // return cached token if valid
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

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

    cachedToken = data.access_token;
    tokenExpiry = now + (data.expires_in - 60) * 1000;

    return cachedToken;
}

export type SimplifiedArtist = {
    id: string;
    name: string;
    image: { url: string; width: number; height: number } | null;
    followers: number;
    genres: string[];
    popularity: number;
};

export async function searchSpotifyArtists(
    query: string
): Promise<SimplifiedArtist[]> {
    console.log("Running searchSpotifyArtists with query:", query);
    if (!query) return [];

    const token = await getSpotifyToken();
    console.log("Fetched token:", token);

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
    )}&type=artist&limit=10`;

    console.log("Fetching Spotify search:", url);

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Spotify response status:", res.status, res.statusText);

    if (!res.ok) {
        const errBody = await res.text();
        console.error("Spotify API error:", errBody);
        throw new Error("Failed to search Spotify artists");
    }

    const data = await res.json();
    console.log("Spotify API response:", data);

    return data.artists.items.map((artist: SpotifyArtist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.at(-2) ?? null,
        followers: artist.followers.total,
        genres: artist.genres,
        popularity: artist.popularity,
    }));
}

export async function searchArtistsAndAlbums(query: string) {
    if (!query || !query.trim()) return {};

    try {
        const results = await SpotifyAPI.searchArtistsAndAlbums(query);
        return results;
    } catch (error) {
        console.error("Error in searchArtistsAndAlbumsAction:", error);
        throw new Error("Failed to fetch Spotify search results");
    }
}

// New server action for submitting reviews
export async function submitReviewAction(
    clerkUserId: string,
    spotifyAlbumId: string,
    albumTitle: string,
    albumArtists: string[],
    reviewTitle?: string,
    rating: number = 0,
    review?: string
) {
    try {
        return await fetchMutation(api.reviews.submitReview, {
            clerkUserId,
            spotifyAlbumId,
            albumTitle,
            albumArtists,
            reviewTitle,
            rating,
            review,
        });
    } catch (error) {
        console.error("Failed to submit review:", error);
        throw new Error("Failed to submit review");
    }
}

export async function getFavouriteArtists(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    try {
        const artists = await SpotifyAPI.getArtists(ids);
        return artists ?? [];
    } catch (error) {
        console.error("❌ Failed to fetch favourite artists:", error);
        return [];
    }
}
