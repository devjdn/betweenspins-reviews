import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getReviewsByAlbum = query({
    args: {
        spotifyAlbumId: v.string(),
    },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_albumId", (q) =>
                q.eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .collect();

        return reviews ?? [];
    },
});

export const getReviewsById = query({
    args: {
        clerkUserId: v.string(),
        spotifyAlbumId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", args.clerkUserId)
            )
            .unique();

        if (!user)
            throw new Error(
                "Couldn't find a user matching the provided clerkUserId."
            );

        const review = await ctx.db
            .query("reviews")
            .withIndex("by_user_album", (q) =>
                q
                    .eq("userId", user._id)
                    .eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .unique();

        return review;
    },
});

export const submitReview = mutation({
    args: {
        clerkUserId: v.string(),
        spotifyAlbumId: v.string(),
        albumTitle: v.string(),
        albumArtists: v.array(v.string()),
        reviewTitle: v.optional(v.string()),
        rating: v.number(),
        review: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", args.clerkUserId)
            )
            .unique();

        if (!user)
            throw new Error(
                "Couldn't find a user matching the provided clerkUserId."
            );

        // Check if user already has a review for this album
        const existingReview = await ctx.db
            .query("reviews")
            .withIndex("by_user_album", (q) =>
                q
                    .eq("userId", user._id)
                    .eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .unique();

        let reviewId;
        const isNewReview = !existingReview;

        if (existingReview) {
            // Update existing review
            await ctx.db.patch(existingReview._id, {
                reviewTitle: args.reviewTitle,
                rating: args.rating,
                review: args.review,
            });
            reviewId = existingReview._id;
        } else {
            reviewId = await ctx.db.insert("reviews", {
                userId: user._id,
                spotifyAlbumId: args.spotifyAlbumId,
                albumTitle: args.albumTitle,
                albumArtists: args.albumArtists,
                reviewTitle: args.reviewTitle,
                rating: args.rating,
                review: args.review,
            });
        }

        // Update album rating
        await ctx.runMutation(api.albumRatings.updateAlbumRating, {
            spotifyAlbumId: args.spotifyAlbumId,
            albumTitle: args.albumTitle,
            rating: args.rating,
            isNewReview,
        });

        return reviewId;
    },
});

export const deleteReview = mutation({
    args: {
        clerkUserId: v.string(),
        id: v.id("reviews"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", args.clerkUserId)
            )
            .unique();

        if (!user)
            throw new Error(
                "Couldn't find a user matching the provided clerkUserId."
            );

        const review = await ctx.db.get(args.id);
        if (!review) throw new Error("No review found with that ID.");

        if (review.userId !== user._id)
            throw new Error("You can only delete your own reviews.");

        await ctx.db.delete(args.id);

        await ctx.runMutation(api.albumRatings.recalculateAlbumRating, {
            spotifyAlbumId: review.spotifyAlbumId,
        });

        return args.id;
    },
});
