import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getReviewsByAlbum = query({
    args: {
        spotifyAlbumId: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Fetch all reviews for this album
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_albumId", (q) =>
                q.eq("spotifyAlbumId", args.spotifyAlbumId)
            )
            .collect();

        return reviews ?? [];
    },
});

export const submitReview = mutation({
    args: {
        clerkUserId: v.string(),
        spotifyAlbumId: v.string(),
        albumTitle: v.string(),
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

        return await ctx.db.insert("reviews", {
            userId: user._id,
            spotifyAlbumId: args.spotifyAlbumId,
            albumTitle: args.albumTitle,
            rating: args.rating,
            review: args.review,
        });
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
        return args.id;
    },
});
