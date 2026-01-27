import Link from "next/link";
import Image from "next/image";
import { SpotifyAlbum } from "@/types/spotify";

export type AlbumCardProps = {
    id: string;
    name: string;
    artists: Array<{
        id: string;
        name: string;
    }>;
    cover: string;
};

export default function AlbumCard({
    id,
    name,
    artists,
    cover,
}: AlbumCardProps) {
    return (
        <div className="flex flex-col gap-y-2">
            <Link href={`/album/${id}`}>
                <div className="relative aspect-square rounded-md overflow-hidden bg-secondary group">
                    <Image
                        src={cover}
                        alt={`${name} Album Cover`}
                        fill
                        sizes="(min-width: 1536px) 320px, 80vw"
                        className="object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 z-50 top bg-transparent group-hover:bg-black/30 transition-colors"></div>
                </div>
            </Link>
            <div className="">
                <Link href={`/album/${id}`}>
                    <p className="text-xs @3xl:text-sm hover:underline truncate">
                        {name}
                    </p>
                </Link>
                <p className="text-muted-foreground text-xs @3xl:text-sm">
                    {artists.map((artist, i) => {
                        const isLast = i === artists.length - 1;
                        const isSecondLast = i === artists.length - 2;
                        return (
                            <span key={artist.id}>
                                <Link
                                    href={`/artist/${artist.id}`}
                                    className="hover:text-foreground hover:underline"
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
                </p>
            </div>
        </div>
    );
}
