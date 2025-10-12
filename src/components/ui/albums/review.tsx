"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PencilLine, X } from "lucide-react";
import ReviewForm from "../review-shared/review-form";
import { AlbumReview } from "@/types/convex";
import UserReview from "./user-review";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

interface ReviewProps
    extends Omit<React.ComponentProps<typeof ReviewForm>, "clerkUserId"> {
    clerkUserId?: string;
}

export default function Review({ album, clerkUserId }: ReviewProps) {
    const userReview = useQuery(
        api.reviews.getReviewsById,
        clerkUserId
            ? {
                  clerkUserId,
                  spotifyAlbumId: album.id,
              }
            : "skip"
    );

    return userReview && clerkUserId ? (
        <UserReview review={userReview} clerkUserId={clerkUserId} />
    ) : !userReview && clerkUserId ? (
        <ReviewForm album={album} clerkUserId={clerkUserId} />
    ) : (
        <p className="text-sm text-muted-foreground">
            Sign in to write a review.
        </p>
    );
}
