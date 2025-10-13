import Tracklist from "@/components/ui/albums/tracklist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpotifyAPI } from "@/lib/spotify";
import {
    ListMusic,
    MessageCircle,
    Pencil,
    Star,
    UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Vibrant } from "node-vibrant/node";
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

    const palette = await Vibrant.from(album.images[0].url).getPalette();
    const darkVibrant = palette.DarkVibrant?.rgb ?? [40, 40, 40];
    const isAlbumExplicit = album.tracks.items.some((t, _) => t.explicit);

    return (
        <div className="space-y-4 mx-auto w-full">
            <header
                className="py-8 px-4 md:px-8 border-b md:mx-6 md:rounded-4xl border-b-muted"
                style={{
                    background: `rgb(${darkVibrant})`,
                }}
            >
                <div className="max-w-6xl w-full mx-auto flex flex-col gap-6 md:grid md:grid-cols-[256px_1fr] items-center md:items-end">
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
                                <div className="inline-flex items-center gap-1">
                                    <h1 className="font-semibold md:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                                        {album.name}
                                    </h1>
                                    {isAlbumExplicit && (
                                        <MdExplicit className="md:size-7" />
                                    )}
                                </div>
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

                        <div className="w-full mx-auto md:mx-0">
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
            <section className="px-4 md:px-8 md:bg-muted/50 md:rounded-4xl md:py-8 md:mx-6">
                <div className="max-w-6xl mx-auto w-full">
                    <Tabs defaultValue="review">
                        <TabsList>
                            <TabsTrigger value="review">
                                <Pencil />
                                <span>Review</span>
                            </TabsTrigger>
                            <TabsTrigger value="community">
                                <MessageCircle />
                                <span>Community</span>
                            </TabsTrigger>
                            <TabsTrigger value="tracks">
                                <ListMusic />
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
