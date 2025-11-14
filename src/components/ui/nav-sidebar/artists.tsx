"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useQuery as useSpotifyQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getFavouriteArtists } from "@/app/actions";
import { Button } from "../button";
import Link from "next/link";
import { FavouriteArtistsSkeleton } from "./artists-skeleton";

export function FavouriteArtists({ clerkUserId }: { clerkUserId: string }) {
    const user = useQuery(api.users.getByClerkId, { clerkUserId });
    const favoriteArtists = user?.favoriteArtists ?? [];
    const canFetchSpotify = !!user && favoriteArtists.length > 0;

    const {
        data: spotifyArtists,
        isFetching,
        isLoading,
        error,
    } = useSpotifyQuery({
        queryKey: ["spotify-artists", favoriteArtists.map((a) => a.artist_id)],
        queryFn: async () => {
            const ids = favoriteArtists.map((a) => a.artist_id);
            if (ids.length === 0) return [];
            const artists = await getFavouriteArtists(ids);
            return artists;
        },
        enabled: canFetchSpotify,
        staleTime: 1000 * 60 * 10,
        placeholderData: (prev) => prev,
    });

    const showSkeleton = isLoading || isFetching || !spotifyArtists;

    return (
        <div className="flex flex-col w-full">
            <p className="pl-4 mb-2 font-medium text-xs text-muted-foreground">
                Favourite Artists
            </p>
            <div>
                {showSkeleton && <FavouriteArtistsSkeleton />}
                {error && <p>Error: {error.message}</p>}
                {spotifyArtists && spotifyArtists.length === 0 && (
                    <p>No artists found</p>
                )}

                {spotifyArtists &&
                    spotifyArtists.map((a, i) => (
                        <Button
                            key={i}
                            variant={"ghost"}
                            size={"lg"}
                            className="gap-2 rounded-md w-full px-4 justify-start"
                            asChild
                        >
                            <Link href={`/artist/${a.id}`}>
                                <div className="aspect-square size-6 border rounded-full relative overflow-hidden">
                                    <Image
                                        src={
                                            a.images.at(-1)?.url ??
                                            a.images[0].url
                                        }
                                        alt={`${a.name}'s Profile Picture`}
                                        loading="lazy"
                                        fill
                                        className="object-center object-cover inset-shadow-media"
                                    />
                                </div>
                                <span className="text-sm">{a.name}</span>
                            </Link>
                        </Button>
                    ))}
            </div>
        </div>
    );
}
