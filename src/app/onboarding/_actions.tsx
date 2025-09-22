"use server";

import { api } from "../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const addBioFromOnboarding = async (
    clerkUserId: string,
    bio: string
) => {
    try {
        return await fetchMutation(api.users.updateBio, {
            clerkUserId: clerkUserId,
            bio: bio,
        });
    } catch (error) {
        console.error("Failed to update bio:", error);
        throw error;
    }
};

export const addFavoriteArtistsFromOnboarding = async (
    clerkUserId: string,
    favoriteArtists: { artist_id: string; name: string }[]
) => {
    try {
        return await fetchMutation(api.users.updateFavoriteArtists, {
            clerkUserId,
            favoriteArtists,
        });
    } catch (error) {
        console.error("Failed to update favorite artists:", error);
        throw error;
    }
};

export const completeOnboarding = async (clerkUserId: string) => {
    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
                onboardingStatus: "completed",
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update onboarding status:", error);
        throw error;
    }
};

export const skipOnboarding = async (clerkUserId: string) => {
    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
                onboardingStatus: "skipped",
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update onboarding status:", error);
        throw error;
    }
};
