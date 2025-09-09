"use server";

import { api } from "../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

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
