import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";

export type CoverProps = {
    albumCover: SpotifyAlbum["images"][0]["url"];
    albumName: SpotifyAlbum["name"];
    shadowColor?: string;
    priority?: boolean;
};

export default function AlbumCover({
    albumCover,
    albumName,
    shadowColor,
    priority = false,
}: CoverProps) {
    return (
        <div
            className="w-80 mx-auto @3xl:mx-0 @3xl:w-auto relative aspect-square rounded-lg overflow-hidden bg-secondary"
            style={{
                boxShadow: shadowColor
                    ? `0 25px 70px ${shadowColor}`
                    : undefined,
            }}
        >
            <Image
                src={albumCover}
                alt={`${albumName} Album Cover`}
                fill
                priority={priority}
                sizes="(min-width: 1536px) 320px, 80vw"
                className="object-cover"
            />

            <div className="absolute inset-0 pointer-events-none rounded-md ring-[1px] shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]" />
        </div>
    );
}
