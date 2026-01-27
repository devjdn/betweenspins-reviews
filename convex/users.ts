import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        clerkUserId: v.string(),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", args.clerkUserId)
            )
            .unique();

        if (existing) return existing._id;

        return await ctx.db.insert("users", {
            clerkUserId: args.clerkUserId,
            bio: args.bio ?? "",
        });
    },
});

export const remove = mutation({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", args.clerkUserId)
            )
            .unique();

        if (!user) return;

        await ctx.db.delete(user._id);
    },
});

export const getByClerkId = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, { clerkUserId }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", clerkUserId)
            )
            .unique();

        if (!user) return null;

        return {
            bio: user.bio ?? "",
            clerkUserId: user.clerkUserId,
        };
    },
});

export const updateBio = mutation({
    args: {
        clerkUserId: v.string(),
        bio: v.string(),
    },
    handler: async (ctx, { clerkUserId, bio }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
                q.eq("clerkUserId", clerkUserId)
            )
            .unique();

        if (user) {
            await ctx.db.patch(user._id, { bio });
        } else {
            await ctx.db.insert("users", { clerkUserId, bio });
        }

        return { success: true };
    },
});

