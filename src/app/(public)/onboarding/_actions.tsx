"use server";

import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export const addBioFromOnboarding = async (
    clerkUserId: string,
    bio: string
): Promise<{ success: true } | { success: false; error: string }> => {
    try {
        await fetchMutation(api.users.updateBio, {
            clerkUserId,
            bio,
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update bio:", error);
        const message =
            error instanceof Error ? error.message : "Failed to save bio";
        return { success: false, error: message };
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
