import Link from "next/link";
import Image from "next/image";
import { SpotifyAlbum } from "@/types/spotify";

export type AlbumCardProps = {
    id: SpotifyAlbum["id"];
    name: SpotifyAlbum["name"];
    artists: SpotifyAlbum["artists"];
    cover: SpotifyAlbum["images"][0]["url"];
};

export default function AlbumCard({
    id,
    name,
    artists,
    cover,
}: AlbumCardProps) {
    return (
        <Link href={`/album/${id}`}>
            <div className="space-y-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                    <Image
                        src={cover}
                        alt={`${name} Album Cover`}
                        fill
                        sizes="(min-width: 1536px) 320px, 80vw"
                        className="object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="">
                    <p className="font-medium text-xs @3xl:text-sm">{name}</p>
                    <p className="text-muted-foreground text-xs @3xl:text-sm">
                        {artists.map((a, i) => (
                            <Link
                                className="hover:text-foreground hover:underline"
                                href={`/artist/${a.id}`}
                                key={i}
                            >
                                <span>{a.name}</span>
                            </Link>
                        ))}
                    </p>
                </div>
            </div>
        </Link>
    );
}
