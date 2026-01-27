import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkUserId: v.string(),
        bio: v.optional(v.string()),
    }).index("by_clerkUserId", ["clerkUserId"]),

    albumReviews: defineTable({
        userId: v.id("users"),
        releaseGroupId: v.string(),

        rating: v.optional(v.number()),
        reviewTitle: v.optional(v.string()),
        review: v.optional(v.string()),

        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index("by_user", ["userId"])
        .index("by_releaseGroupId", ["releaseGroupId"])
        .index("by_user_releaseGroup", ["userId", "releaseGroupId"]),


    artists: defineTable({
        artistId: v.string(),
        name: v.string(),
        sortName: v.optional(v.string()),
        disambiguation: v.optional(v.string()),
        image: v.optional(v.string()), // future use
        createdAt: v.number(),
    })
        .index("by_artistId", ["artistId"])
        .index("by_name", ["name"]),

    albums: defineTable({
        releaseGroupId: v.string(),
        createdAt: v.number(),
        title: v.string(),
        albumArtists: v.array(
            v.object({
                id: v.string(),
                name: v.string(),
            })
        ),
        year: v.optional(v.number()),
        coverArt: v.optional(
            v.object({
                full: v.string(),
                thumbnail: v.string(),
            })
        ),
        genres: v.array(v.string()),
        isCompilation: v.boolean(),
        tracks: v.array(
            v.object({
                disc: v.number(),
                position: v.number(),
                title: v.string(),
                durationMs: v.optional(v.number()),
                artists: v.array(
                    v.object({
                        id: v.string(),
                        name: v.string(),
                    })
                ),
            })
        ),
    }).index("by_releaseGroupId", ["releaseGroupId"]),
});
