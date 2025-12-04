import Tracklist from "@/components/ui/albums/tracklist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpotifyAPI } from "@/lib/spotify/spotify";
import { getAverageColor } from "fast-average-color-node";
import { FaSpotify } from "react-icons/fa";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import Review from "@/components/ui/albums/review";
import AlbumReviews from "@/components/ui/albums/album-reviews";
import { currentUser } from "@clerk/nextjs/server";
import { MdExplicit } from "react-icons/md";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SpotifyAlbum } from "@/types/spotify";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import { AlbumHeader } from "@/components/ui/album/header";
import ShaderColorUpdater from "@/components/shaders/shader-updater";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // "use cache";
    const { id } = await params;
    const album = await SpotifyAPI.getAlbum(id);

    return {
        title: `${album.name} by ${album.artists[0].name}`,
    };
}

export default async function AlbumIdPage({ params }: Props) {
    const { id } = await params;
    const user = await currentUser();

    let album;
    try {
        // ("use cache");
        album = await SpotifyAPI.getAlbum(id);
        if (!album || !album.id) throw new Error("Invalid album");
    } catch (err) {
        notFound();
    }

    // Fetch reviews & ratings concurrently
    const [reviews, rating, color] = await Promise.all([
        fetchQuery(api.reviews.getReviewsByAlbum, { spotifyAlbumId: id }),
        fetchQuery(api.albumRatings.getAlbumRating, { spotifyAlbumId: id }),
        getAverageColor(album.images[0].url),
    ]);
    const isAlbumExplicit = album.tracks.items.some((t, _) => t.explicit);

    return (
        <>
            <div className="@container space-y-4 w-full">
                <AlbumHeader
                    albumCover={album.images[0].url}
                    albumName={album.name}
                    isExplicit={isAlbumExplicit}
                    artists={album.artists}
                    color={{
                        rgb: color.rgb,
                        isLight: color.isLight,
                        isDark: color.isDark,
                    }}
                    spotifyUrl={album.external_urls.spotify}
                />
                <Separator />
            </div>
            <ShaderColorUpdater
                color1={color.hex}
                color2={color.hex}
                color3={color.hex}
            />
        </>
    );
}
