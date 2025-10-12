"use client";

import * as React from "react";
import ReviewForm from "../review/review-form";
import UserReview from "./user-review";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { ReviewFormSkeleton } from "../review/skeleton";
import { useReviewStore } from "@/stores/useReviewStore";

interface ReviewProps
    extends Omit<React.ComponentProps<typeof ReviewForm>, "clerkUserId"> {
    clerkUserId?: string;
}

export default function Review({ album, clerkUserId }: ReviewProps) {
    const { userReview, setUserReview } = useReviewStore();

    const fetchedReview = useQuery(
        api.reviews.getReviewsById,
        clerkUserId ? { clerkUserId, spotifyAlbumId: album.id } : "skip"
    );

    React.useEffect(() => {
        if (fetchedReview !== undefined) {
            setUserReview(fetchedReview);
        }
    }, [fetchedReview, setUserReview]);

    return clerkUserId ? (
        fetchedReview === undefined && userReview === null ? (
            <ReviewFormSkeleton />
        ) : userReview && userReview !== "none" ? (
            <UserReview review={userReview} clerkUserId={clerkUserId} />
        ) : (
            <ReviewForm album={album} clerkUserId={clerkUserId} />
        )
    ) : (
        <p className="text-sm text-muted-foreground">
            Sign in to write a review.
        </p>
    );
}
