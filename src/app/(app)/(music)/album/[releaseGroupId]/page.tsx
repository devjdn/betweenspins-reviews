import { fetchQuery, fetchAction } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import AlbumClient from "./album-client";
import ShaderColorUpdater from "@/components/shaders/shader-updater";
import { getAverageColor } from "fast-average-color-node";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{
        releaseGroupId: string;
    }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { releaseGroupId } = await params;

    const album = await fetchQuery(api.albums.queries.getByReleaseGroupId, { releaseGroupId });

    if (!album) return {
        title: "Album"
    }

    return {
        title: `${album.title} - ${album.albumArtists.map((a) => a.name).join(" & ")}`
    }
}

export default async function AlbumPage({ params }: Props) {
    const { releaseGroupId } = await params;

    let album = await fetchQuery(
        api.albums.queries.getByReleaseGroupId,
        { releaseGroupId }
    );

    if (!album) {
        await fetchAction(
            api.albums.actions.ingestFromMusicBrainz,
            { releaseGroupId }
        );

        album = await fetchQuery(
            api.albums.queries.getByReleaseGroupId,
            { releaseGroupId }
        );
    }

    if (!album) {
        throw new Error(
            `Album ingestion failed for releaseGroupId=${releaseGroupId}`
        );
    }

    let color = "";

    if (album.coverArt?.thumbnail) {
        try {
            const result = await getAverageColor(album.coverArt.thumbnail);
            color = result.rgb;
        } catch {
            color = "";
        }
    }


    return (
        <>
            <AlbumClient
                releaseGroupId={releaseGroupId}
                initialAlbum={album}
            />
            <ShaderColorUpdater color={color} />
        </>
    );
}
