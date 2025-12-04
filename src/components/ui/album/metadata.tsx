import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { MdExplicit } from "react-icons/md";

export type AlbumMetaProps = {
    albumName: SpotifyAlbum["name"];
    isExplicit: boolean;
    artists: SpotifyAlbum["artists"];
};

export default function AlbumMetadata({
    albumName,
    isExplicit,
    artists,
}: AlbumMetaProps) {
    return (
        <div className="space-y-1 font-display text-center @3xl:text-left">
            <span className="inline-flex items-baseline flex-wrap font-semibold text-xl @3xl:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                <span>{albumName}</span>
                <span className="inline ml-1 translate-y-[2px]">
                    {isExplicit && (
                        <MdExplicit className="@3xl:size-7 text-destructive" />
                    )}
                </span>
            </span>

            <div className="font-normal @3xl:font-medium @3xl:text-2xl">
                {artists.map((artist, i) => {
                    const isLast = i === artists.length - 1;
                    const isSecondLast = i === artists.length - 2;
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
                                    {isSecondLast ? " & " : ", "}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
