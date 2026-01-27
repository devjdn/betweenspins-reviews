"use server";

import { SpotifyAPI } from "@/lib/spotify/helpers";
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
// export async function submitReviewAction(
//     clerkUserId: string,
//     spotifyAlbumId: string,
//     albumTitle: string,
//     albumArtists: string[],
//     reviewTitle?: string,
//     rating: number = 0,
//     review?: string
// ) {
//     try {
//         return await fetchMutation(api.reviews.submitReview, {
//             clerkUserId,
//             spotifyAlbumId,
//             albumTitle,
//             albumArtists,
//             reviewTitle,
//             rating,
//             review,
//         });
//     } catch (error) {
//         console.error("Failed to submit review:", error);
//         throw new Error("Failed to submit review");
//     }
// }

