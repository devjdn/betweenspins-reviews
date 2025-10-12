import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "../empty";
import { AlbumReview } from "@/types/convex";
import { Star, StarHalf, StarOff } from "lucide-react";

interface AlbumReviewsProps {
    spotifyAlbumId: string;
    reviews: AlbumReview[];
}

export default function AlbumReviews({
    spotifyAlbumId,
    reviews,
}: AlbumReviewsProps) {
    if (reviews.length === 0) {
        return (
            <Empty className="h-75 flex flex-col items-center">
                <EmptyHeader>
                    <EmptyTitle>No reviews found</EmptyTitle>
                    <EmptyDescription>
                        Be the first to review this album.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
                <div
                    key={review._id || i}
                    className="space-y-3 p-4 rounded-lg md:rounded-2xl bg-card"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => {
                                    const fullStars = Math.floor(
                                        review.rating / 2
                                    );
                                    const hasHalfStar = review.rating % 2 !== 0;

                                    if (review.rating === 0) {
                                        // All empty stars for a fat zero
                                        return (
                                            <StarOff
                                                key={i}
                                                className="text-muted-foreground size-4"
                                            />
                                        );
                                    }

                                    if (i < fullStars) {
                                        return (
                                            <Star
                                                key={i}
                                                className="text-yellow-400 stroke-none size-4 fill-yellow-400"
                                            />
                                        );
                                    }

                                    if (i === fullStars && hasHalfStar) {
                                        return (
                                            <StarHalf
                                                key={i}
                                                className="text-yellow-400 size-4 stroke-none fill-yellow-400"
                                            />
                                        );
                                    }

                                    return (
                                        <StarOff
                                            key={i}
                                            className="text-muted-foreground size-4"
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-sm font-medium">
                                {review.rating}/10
                            </span>
                        </div>
                    </div>

                    {review.reviewTitle && (
                        <h4 className="font-medium text-sm leading-tight">
                            {review.reviewTitle}
                        </h4>
                    )}

                    {review.review && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {review.review}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
