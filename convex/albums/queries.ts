import { query } from "../_generated/server";
import { v } from "convex/values";

export const getByReleaseGroupId = query({
    args: {
        releaseGroupId: v.string(),
    },
    handler: async (ctx, { releaseGroupId }) => {
        return ctx.db
            .query("albums")
            .withIndex("by_releaseGroupId", q =>
                q.eq("releaseGroupId", releaseGroupId)
            )
            .first();
    },
});
