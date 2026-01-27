import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const upsertAlbumWithArtists = internalMutation({
    args: {
        album: v.object({
            releaseGroupId: v.string(),
            title: v.string(),
            year: v.optional(v.number()),
            coverArt: v.optional(
                v.object({
                    full: v.string(),
                    thumbnail: v.string(),
                })
            ),
            albumArtists: v.array(
                v.object({
                    id: v.string(),
                    name: v.string(),
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
        }),
    },

    handler: async (ctx, { album }) => {
        // 1️⃣ Upsert album FIRST (idempotent anchor)
        const existing = await ctx.db
            .query("albums")
            .withIndex("by_releaseGroupId", q =>
                q.eq("releaseGroupId", album.releaseGroupId)
            )
            .first();

        let albumId;

        if (existing) {
            await ctx.db.patch(existing._id, {
                title: album.title,
                year: album.year,
                coverArt: album.coverArt,
                genres: album.genres,
                tracks: album.tracks,
                albumArtists: album.albumArtists,
                isCompilation: album.isCompilation,
            });

            albumId = existing._id;
        } else {
            albumId = await ctx.db.insert("albums", {
                ...album,
                createdAt: Date.now(),
            });
        }

        // 2️⃣ Upsert artists (can be parallelised later)
        const artistMap = new Map<string, string>();

        album.albumArtists.forEach(a =>
            artistMap.set(a.id, a.name)
        );
        album.tracks.forEach(track =>
            track.artists.forEach(a =>
                artistMap.set(a.id, a.name)
            )
        );

        for (const [artistId, name] of artistMap) {
            const exists = await ctx.db
                .query("artists")
                .withIndex("by_artistId", q =>
                    q.eq("artistId", artistId)
                )
                .first();

            if (!exists) {
                await ctx.db.insert("artists", {
                    artistId,
                    name,
                    createdAt: Date.now(),
                });
            }
        }

        return await ctx.db.get(albumId);
    }
});
