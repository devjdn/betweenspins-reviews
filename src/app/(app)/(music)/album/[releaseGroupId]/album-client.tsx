"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
// import AlbumSkeleton from "./album-skeleton";
import { AlbumHeader } from "@/components/ui/album/header/header";
import Tracklist from "@/components/ui/album/content/tracklist";
import { Separator } from "@/components/ui/separator";
import AlbumInfo from "@/components/ui/album/content/info";
import { msToHoursMinutes } from "@/lib/spotify/helpers";

type Album = NonNullable<
    ReturnType<typeof useQuery<typeof api.albums.queries.getByReleaseGroupId>>
>;

export default function AlbumClient({
    releaseGroupId,
    initialAlbum,
}: {
    releaseGroupId: string;
    initialAlbum: Album | null;
}) {
    const liveAlbum = useQuery(
        api.albums.queries.getByReleaseGroupId,
        { releaseGroupId }
    );

    const album = liveAlbum ?? initialAlbum;

    if (!album) return null;

    const isExplicit = false;


    const tracklist = album.tracks;

    const totalDurationMs = tracklist.reduce(
        (sum, track) => sum + (track.durationMs ?? 0),
        0
    )

    const runtime = msToHoursMinutes(totalDurationMs)


    return (
        <>
            <div className="@container w-full">
                <AlbumHeader
                    albumCover={album.coverArt?.full ?? ""}
                    albumName={album.title}
                    isExplicit={isExplicit}
                    artists={album.albumArtists}
                    mainGenre={album.genres[0]}
                    releaseYear={album.year ?? "Release date not listed"}
                />

                <Separator className="mt-4 mb-8" />

                <div className="flex flex-col gap-16 @3xl:grid grid-cols-[1fr_256px]">
                    <section className="space-y-4">
                        <h2 className="font-display font-semibold text-lg @3xl:text-xl">
                            Tracklist
                        </h2>

                        <Tracklist tracks={tracklist} />
                    </section>
                    <section className="space-y-4">
                        <h2 className="font-display font-semibold text-lg @3xl:text-xl">
                            Info
                        </h2>

                        <AlbumInfo runtime={runtime} totalTracks={tracklist.length} genres={album.genres} averageRating={0} reviewCount={0} />
                    </section>
                    <section className="space-y-4 col-span-2">
                        <h2 className="font-display font-semibold text-lg @3xl:text-xl">
                            Reviews
                        </h2>

                        <div className="min-h-32 grid place-items-center">
                            <p className="text-sm text-muted-foreground text-center">No reviews found.</p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
