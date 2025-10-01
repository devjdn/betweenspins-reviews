import Tracklist from "@/components/ui/albums/tracklist";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpotifyAPI } from "@/lib/spotify";
import { Library, Pen, Pencil, PencilLine, UserStar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Vibrant } from "node-vibrant/node";
import { FaSpotify } from "react-icons/fa";

export default async function AlbumIdPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const album = await SpotifyAPI.getAlbum(id);
    const tracks = await SpotifyAPI.getAlbumTracks(id);

    // Get palette from album cover
    const palette = await Vibrant.from(album.images[0].url).getPalette();
    const darkVibrant = palette.DarkVibrant?.rgb ?? [40, 40, 40];
    const darkMuted = palette.DarkMuted?.rgb ?? [40, 40, 40];

    return (
        <div className="space-y-8 mx-auto w-full">
            <header
                className="pb-8 pt-28 px-4 md:px-8"
                style={{
                    background: `rgb(${darkVibrant})`,
                }}
            >
                <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 md:grid md:grid-cols-[256px_1fr] items-center md:items-end">
                    <div className="w-54 md:w-auto relative aspect-square shadow-lg md:shadow-2xl overflow-hidden bg-secondary">
                        <Image
                            src={album.images[0].url}
                            alt={`${album.name} Album Cover`}
                            fill
                            priority
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-1 text-center md:text-left md:tracking-tight">
                                <h1 className="font-semibold md:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                                    {album.name}
                                </h1>
                                <div className="font-normal md:font-semibold md:text-2xl">
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
                                <p>{album.release_date.split("-")[0]}</p>
                                <p>{"•"}</p>
                                <p className="capitalize">{album.album_type}</p>
                            </div>
                        </div>

                        <div className="w-fit space-x-2 mx-auto md:mx-0 flex items-center">
                            <Button>
                                <PencilLine />
                                <span>Write a review</span>
                            </Button>
                            <Button variant={"link"}>
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
                                <UserStar className="" />
                                <span>Reviews</span>
                            </TabsTrigger>
                            <TabsTrigger value="tracks">
                                <Library />
                                <span>{tracks.total} Tracks</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="reviews">
                            <div className="h-48 flex flex-col justify-center items-center gap-2">
                                <p className="text-muted-foreground text-center">
                                    Be the first to review this album.
                                </p>
                            </div>
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
