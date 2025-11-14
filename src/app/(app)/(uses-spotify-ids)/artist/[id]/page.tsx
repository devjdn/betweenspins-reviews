import { Button } from "@/components/ui/button";
import { SpotifyAPI } from "@/lib/spotify/spotify";
import { getAverageColor } from "fast-average-color-node";

import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa";
import Image from "next/image";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const artist = await SpotifyAPI.getArtist(id);

    return {
        title: `${artist.name}`,
    };
}

export default async function ArtistIdPage({ params }: Props) {
    const { id } = await params;
    const artist = await SpotifyAPI.getArtist(id);

    const color = await getAverageColor(artist.images[0].url);
    const [r, g, b] = color.value;

    const darkened = [
        Math.max(0, r * 0.9),
        Math.max(0, g * 0.9),
        Math.max(0, b * 0.9),
    ];

    // Gradient string
    const gradient = `linear-gradient(to bottom, ${
        color.rgb
    }, rgba(${darkened.join(",")}, 0.4))`;

    return (
        <div className="@container space-y-4 w-full">
            <header
                className="py-6 px-4 @3xl:px-6 md:rounded-xl"
                style={{
                    background: gradient,
                }}
            >
                <div className="flex flex-col gap-6 @3xl:grid @3xl:grid-cols-[256px_1fr] items-center @3xl:items-end">
                    <div className="w-80 @3xl:w-auto relative aspect-square shadow-md @3xl:shadow-2xl rounded-full overflow-hidden bg-secondary">
                        <Image
                            src={artist.images[0].url}
                            alt={`${artist.name} artist Cover`}
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        <div className="h-full w-full absolute top-0 left-0 rounded-full inset-shadow-media"></div>
                    </div>

                    <div className="space-y-4 @3xl:space-y-8">
                        <div className="text-center @3xl:text-left @3xl:tracking-tight">
                            <span className="font-semibold @3xl:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                                <span>{artist.name}</span>
                            </span>
                        </div>

                        <div className="w-fit">
                            <Button
                                className="w-full @3xl:w-auto"
                                variant={"mediaOption"}
                                size={"lg"}
                                asChild
                            >
                                <Link
                                    href={artist.external_urls.spotify}
                                    target="_blank"
                                >
                                    <FaSpotify />
                                    <span>Listen on Spotify</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
