import { create } from "zustand";
import type { AlbumReview } from "@/types/convex";

type ReviewValue = AlbumReview | "none" | null;

interface ReviewState {
    userReview: ReviewValue;
    setUserReview: (review: AlbumReview | null) => void;
    clearUserReview: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
    userReview: null,
    setUserReview: (review) => set({ userReview: review ?? "none" }),
    clearUserReview: () => set({ userReview: "none" }),
}));
