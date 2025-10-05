import Tracklist from "@/components/ui/albums/tracklist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpotifyAPI } from "@/lib/spotify";
import { Library, Star, UserStar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Vibrant } from "node-vibrant/node";
import { FaSpotify } from "react-icons/fa";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import Review from "@/components/ui/albums/review";

export default async function AlbumIdPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [album, tracks] = await Promise.all([
        SpotifyAPI.getAlbum(id),
        SpotifyAPI.getAlbumTracks(id),
    ]);
    const reviews = await fetchQuery(api.reviews.getReviewsByAlbum, {
        spotifyAlbumId: id,
    });

    const avgRating = reviews.length
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : "0.0";

    const palette = await Vibrant.from(album.images[0].url).getPalette();
    const darkVibrant = palette.DarkVibrant?.rgb ?? [40, 40, 40];

    return (
        <div className="space-y-8 mx-auto w-full">
            <header
                className="pb-8 pt-28 px-4 md:px-8 border-b border-b-muted"
                style={{
                    background: `linear-gradient(to top, rgb(${darkVibrant}), var(--background))`,
                }}
            >
                <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 md:grid md:grid-cols-[256px_1fr] items-center md:items-end">
                    <div className="w-80 md:w-auto relative aspect-square shadow-lg rounded-lg md:shadow-2xl overflow-hidden bg-secondary">
                        <Image
                            src={album.images[0].url}
                            alt={`${album.name} Album Cover`}
                            fill
                            priority
                        />
                    </div>

                    <div className="space-y-4 md:space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-1 text-center md:text-left md:tracking-tight">
                                <h1 className="font-medium md:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                                    {album.name}
                                </h1>
                                <div className="font-normal md:font-medium md:text-2xl">
                                    {album.artists.map((artist, i) => {
                                        const isLast =
                                            i === album.artists.length - 1;
                                        const isSecondLast =
                                            i === album.artists.length - 2;
                                        return (
                                            <span key={artist.id}>
                                                <Link
                                                    href={`/artist/${artist.id}`}
                                                    className="hover:underline"
                                                >
                                                    {artist.name}
                                                </Link>
                                                {!isLast && (
                                                    <span className="opacity-70">
                                                        {isSecondLast
                                                            ? " & "
                                                            : ", "}
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-fit text-sm h-4 space-x-2 mx-auto md:mx-0 flex items-center">
                                <span className="flex gap-1 items-center">
                                    <Star className="size-3.5" />
                                    {avgRating} {`(${reviews.length} ratings)`}
                                </span>
                                <p>{"•"}</p>
                                <p>{album.release_date.split("-")[0]}</p>
                                <p>{"•"}</p>
                                <p className="capitalize">{album.album_type}</p>
                            </div>
                        </div>

                        <div className="w-full mx-auto md:mx-0 grid grid-cols-2 gap-2 md:flex md:w-fit md:gap-2">
                            <Review album={album} />

                            <Button
                                className="w-full md:w-auto"
                                variant="mediaOption"
                                size={"lg"}
                            >
                                <FaSpotify />
                                <span>Listen on Spotify</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <section className=" px-4 md:px-8">
                <div className="max-w-7xl mx-auto w-full">
                    <Tabs defaultValue="reviews">
                        <TabsList>
                            <TabsTrigger value="reviews">
                                <UserStar />
                                <span>Reviews</span>
                            </TabsTrigger>
                            <TabsTrigger value="tracks">
                                <Library />
                                <span>Tracklist</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="reviews">
                            {reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {reviews.map((review, i) => (
                                        <div key={i}>
                                            <p>{review.rating}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-75 flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-medium">
                                            No reviews found
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Be the first to review this album.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="tracks">
                            <Tracklist tracks={tracks} />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
