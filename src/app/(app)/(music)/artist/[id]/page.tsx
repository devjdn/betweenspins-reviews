import { SpotifyAPI } from "@/lib/spotify/helpers";
import { getAverageColor } from "fast-average-color-node";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ArtistHeader } from "@/components/ui/artist/header/header";
import { Separator } from "@/components/ui/separator";
import ShaderColorUpdater from "@/components/shaders/shader-updater";

import ArtistAlbumsSection from "@/components/ui/artist/albums/albums";

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

    const [artist, albums] = await Promise.all([
        SpotifyAPI.getArtist(id),
        SpotifyAPI.getArtistAlbums(id, { limit: 6, include_groups: "album" }),
    ]);

    if (!artist || !artist.id) notFound();

    const color = await getAverageColor(artist.images[0].url);

    return (
        <>
            <div className="@container space-y-4 w-full">
                <ArtistHeader
                    artistCover={artist.images[0].url}
                    artistName={artist.name}
                    genres={artist.genres}
                    color={{
                        rgb: color.rgb,
                        isLight: color.isLight,
                        isDark: color.isDark,
                    }}
                    spotifyUrl={artist.external_urls.spotify}
                />
                <Separator />
                <ArtistAlbumsSection albums={albums} artistId={id} />
            </div>
            <ShaderColorUpdater color={color.rgb} />
        </>
    );
}
