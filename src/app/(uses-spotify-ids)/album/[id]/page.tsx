import Tracklist from "@/components/ui/albums/tracklist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpotifyAPI } from "@/lib/spotify";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAverageColor } from "fast-average-color-node";
import { FaSpotify } from "react-icons/fa";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import Review from "@/components/ui/albums/review";
import AlbumReviews from "@/components/ui/albums/album-reviews";
import { currentUser } from "@clerk/nextjs/server";
import { MdExplicit } from "react-icons/md";

export default async function AlbumIdPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await currentUser();

    const [album, reviews, rating] = await Promise.all([
        SpotifyAPI.getAlbum(id),
        fetchQuery(api.reviews.getReviewsByAlbum, { spotifyAlbumId: id }),
        fetchQuery(api.albumRatings.getAlbumRating, { spotifyAlbumId: id }),
    ]);

    const color = await getAverageColor(album.images[0].url);
    const [r, g, b] = color.value;

    // Create a slightly darkened version
    const darkened = [
        Math.max(0, r * 0.9),
        Math.max(0, g * 0.9),
        Math.max(0, b * 0.9),
    ];

    // Gradient string
    const gradient = `linear-gradient(to bottom, ${
        color.rgb
    }, rgba(${darkened.join(",")}, 0.4))`;
    const isAlbumExplicit = album.tracks.items.some((t, _) => t.explicit);

    return (
        <div className="@container space-y-4 w-full">
            <header
                className="py-6 px-4 @3xl:px-6 md:rounded-xl"
                style={{
                    background: gradient,
                }}
            >
                <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 @3xl:grid @3xl:grid-cols-[256px_1fr] items-center @3xl:items-end">
                    <div className="w-80 @3xl:w-auto relative aspect-square shadow-md @3xl:shadow-2xl rounded-md overflow-hidden bg-secondary">
                        <Image
                            src={album.images[0].url}
                            alt={`${album.name} Album Cover`}
                            fill
                            priority
                        />
                        <div className="h-full w-full absolute top-0 left-0 rounded-md inset-shadow-media"></div>
                    </div>

                    <div className="space-y-4 @3xl:space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-1 text-center @3xl:text-left @3xl:tracking-tight">
                                <span className="inline-flex items-baseline flex-wrap font-semibold @3xl:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                                    <span>{album.name}</span>
                                    <span className="inline ml-1 translate-y-[2px]">
                                        {isAlbumExplicit && (
                                            <MdExplicit className="@3xl:size-7" />
                                        )}
                                    </span>
                                </span>
                                <div className="font-normal @3xl:font-medium @3xl:text-2xl">
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

                            <div className="w-fit text-sm h-4 space-x-2 mx-auto @3xl:mx-0 flex items-center">
                                <span className="inline-flex gap-1 items-center">
                                    <Star className="size-3.5" />
                                    <p className="">{`${
                                        rating
                                            ? rating.averageRating
                                            : "Unrated"
                                    }`}</p>
                                </span>
                                <p>{"•"}</p>
                                <p>{album.release_date.split("-")[0]}</p>
                                <p>{"•"}</p>
                                <p className="capitalize">{album.album_type}</p>
                            </div>
                        </div>

                        <div className="w-full mx-auto @3xl:mx-0">
                            <Button
                                className="w-full @3xl:w-auto"
                                variant={
                                    color.isDark ? "default" : "mediaOption"
                                }
                                size={"lg"}
                            >
                                <FaSpotify />
                                <span>Listen on Spotify</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <section className="px-4 md:px-6">
                <div className="max-w-6xl mx-auto w-full">
                    <Tabs defaultValue="review">
                        <TabsList>
                            <TabsTrigger value="review">
                                {/* <Pencil /> */}
                                <span>Review</span>
                            </TabsTrigger>
                            <TabsTrigger value="community">
                                {/* <MessageCircle /> */}
                                <span>Community</span>
                            </TabsTrigger>
                            <TabsTrigger value="tracks">
                                {/* <ListMusic /> */}
                                <span>Tracklist</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="review" className="pt-4">
                            <Review
                                album={album}
                                clerkUserId={user?.id ?? undefined}
                            />
                        </TabsContent>
                        <TabsContent value="community" className="pt-4">
                            <AlbumReviews
                                reviews={reviews}
                                spotifyAlbumId={id}
                            />
                        </TabsContent>
                        <TabsContent value="tracks">
                            <Tracklist
                                tracks={album.tracks}
                                releaseDate={album.release_date}
                                copyrights={album.copyrights}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
