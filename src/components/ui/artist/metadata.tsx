import Link from "next/link";
import { SpotifyArtist } from "@/types/spotify";

export type ArtistMetaProps = {
    artistName: SpotifyArtist["name"];

    genres: SpotifyArtist["genres"];
    artistId: SpotifyArtist["id"];
};

export default function ArtistMetadata({
    artistName,

    genres,
    artistId,
}: ArtistMetaProps) {
    return (
        <div className="space-y-2 font-display text-center @3xl:text-left">
            <div className="inline-flex items-baseline flex-wrap font-semibold text-xl @3xl:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                <Link href={`/artist/${artistId}`} className="hover:underline">
                    {artistName}
                </Link>
            </div>

            <div className="font-normal @3xl:font-medium @3xl:text-lg space-y-1">
                {genres.length > 0 && (
                    <div className="flex flex-wrap justify-center @3xl:justify-start gap-2 text-sm">
                        {genres.slice(0, 6).map((genre) => (
                            <span
                                key={genre}
                                className="rounded-full bg-muted px-3 py-1 capitalize"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
