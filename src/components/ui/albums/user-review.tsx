"use client";

import { AlbumReview } from "@/types/convex";
import { Star, Trash2 } from "lucide-react";
import { Button } from "../button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserReviewProps {
    review: AlbumReview;
    clerkUserId: string;
}

export default function UserReview({ review, clerkUserId }: UserReviewProps) {
    const deleteReview = useMutation(api.reviews.deleteReview);
    const handleDelete = () => {
        deleteReview({
            clerkUserId: clerkUserId,
            id: review._id as Id<"reviews">,
        });
    };
    return (
        <div className="space-y-4">
            <header className="w-full flex flex-col gap-4 pb-2 border-b">
                <div className="flex gap-4 justify-between items-center">
                    <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                        <span className="font-medium">{review.rating}/10</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete()}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                <h3 className="font-semibold text-lg max-w-prose">
                    {review.reviewTitle || "No review title"}
                </h3>
            </header>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {review.review ? review.review : "No review content"}
            </p>
        </div>
    );
}
