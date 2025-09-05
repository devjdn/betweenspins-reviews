// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(), // Clerk's user.id
        bio: v.optional(v.string()), // user bio
        favoriteArtists: v.optional(
            v.array(
                v.object({
                    artist_id: v.string(), // Spotify artist ID
                    name: v.string(),
                })
            )
        ),
    }).index("by_clerkUserId", ["clerkUserId"]),

    reviews: defineTable({
        userId: v.id("users"), // user who left the review
        spotifyAlbumId: v.string(), // Spotify album ID
        rating: v.number(), // required 1–10 or 1–5 scale
        review: v.optional(v.string()), // optional text review
    })
        .index("by_user", ["userId"])
        .index("by_album", ["spotifyAlbumId"])
        .index("by_user_album", ["userId", "spotifyAlbumId"]), // ensure one review per album per user
});
