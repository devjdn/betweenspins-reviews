import Image from "next/image";
import { SpotifyArtist } from "@/types/spotify";

export type ArtistCoverProps = {
    artistCover: SpotifyArtist["images"][0]["url"];
    artistName: SpotifyArtist["name"];
    shadowColor?: string;
    priority?: boolean;
};

export default function ArtistCover({
    artistCover,
    artistName,
    shadowColor,
    priority = false,
}: ArtistCoverProps) {
    return (
        <div
            className="w-80 mx-auto @3xl:mx-0 @3xl:w-auto relative aspect-square rounded-full overflow-hidden bg-secondary"
            style={{
                boxShadow: shadowColor
                    ? `0 25px 70px ${shadowColor}`
                    : undefined,
            }}
        >
            <Image
                src={artistCover}
                alt={`${artistName} portrait`}
                fill
                priority={priority}
                sizes="(min-width: 1536px) 320px, 80vw"
                className="object-center object-cover"
            />

            <div className="absolute inset-0 pointer-events-none rounded-md ring-[1px] shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]" />
        </div>
    );
}
