import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(),
        bio: v.optional(v.string()),
        favoriteArtists: v.optional(
            v.array(
                v.object({
                    artist_id: v.string(),
                    name: v.string(),
                })
            )
        ),
    }).index("by_clerkUserId", ["clerkUserId"]),

    reviews: defineTable({
        userId: v.id("users"),
        spotifyAlbumId: v.string(),
        albumTitle: v.string(),
        albumArtists: v.array(v.string()),
        reviewTitle: v.optional(v.string()),
        rating: v.number(),
        review: v.optional(v.string()),
    })
        .index("by_user", ["userId"])
        .index("by_albumId", ["spotifyAlbumId"])
        .index("by_title", ["albumTitle"])
        .index("by_user_album", ["userId", "spotifyAlbumId"]),

    albumRatings: defineTable({
        spotifyAlbumId: v.string(),
        albumTitle: v.string(),
        averageRating: v.number(),
        totalRatings: v.number(),
    }).index("by_albumId", ["spotifyAlbumId"]),
});
