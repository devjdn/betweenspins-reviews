import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAlbumRating = query({
    args: {
        spotifyAlbumId: v.string(),
    },
    handler: async (ctx, args) => {
        const rating = await ctx.db
            .query("albumRatings")
            .withIndex("by_albumId", (q) =>
                q.eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .unique();

        return rating;
    },
});

export const updateAlbumRating = mutation({
    args: {
        spotifyAlbumId: v.string(),
        albumTitle: v.string(),
        rating: v.number(),
        isNewReview: v.boolean(),
    },
    handler: async (ctx, args) => {
        const existingRating = await ctx.db
            .query("albumRatings")
            .withIndex("by_albumId", (q) =>
                q.eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .unique();

        if (existingRating) {
            // Update existing rating
            const newTotalRatings = args.isNewReview
                ? existingRating.totalRatings + 1
                : existingRating.totalRatings;

            // Get all reviews for this album to recalculate average
            const reviews = await ctx.db
                .query("reviews")
                .withIndex("by_albumId", (q) =>
                    q.eq("spotifyAlbumId", args.spotifyAlbumId)
                )
                .collect();

            const averageRating =
                reviews.length > 0
                    ? reviews.reduce((acc, review) => acc + review.rating, 0) /
                      reviews.length
                    : 0;

            await ctx.db.patch(existingRating._id, {
                averageRating,
                totalRatings: newTotalRatings,
            });

            return existingRating._id;
        } else {
            // Create new rating entry
            return await ctx.db.insert("albumRatings", {
                spotifyAlbumId: args.spotifyAlbumId,
                albumTitle: args.albumTitle,
                averageRating: args.rating,
                totalRatings: 1,
            });
        }
    },
});

// Add a new mutation specifically for recalculating ratings after deletion
export const recalculateAlbumRating = mutation({
    args: {
        spotifyAlbumId: v.string(),
    },
    handler: async (ctx, args) => {
        // Get all remaining reviews for this album
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_albumId", (q) =>
                q.eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .collect();

        const existingRating = await ctx.db
            .query("albumRatings")
            .withIndex("by_albumId", (q) =>
                q.eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .unique();

        if (!existingRating) {
            // No rating record exists, nothing to update
            return null;
        }

        if (reviews.length === 0) {
            // No reviews left, delete the rating record
            await ctx.db.delete(existingRating._id);
            return null;
        }

        // Recalculate average from remaining reviews
        const averageRating =
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length;

        await ctx.db.patch(existingRating._id, {
            averageRating,
            totalRatings: reviews.length,
        });

        return existingRating._id;
    },
});
