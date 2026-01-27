import { SpotifyAlbum } from "@/types/spotify";
import ArtistSection from "../section/section";
import AlbumCard from "../../music/card";

export type ArtistAlbumsSectionTypes = {
    albums: SpotifyAlbum[];
    artistId: string;
};

export default function ArtistAlbumsSection({
    albums,
    artistId,
}: ArtistAlbumsSectionTypes) {
    return (
        <ArtistSection title="Albums" link={`/${artistId}/albums`}>
            <div className="grid grid-cols-2 gap-y-6 @3xl:grid-cols-3 @4xl:grid-cols-4 @7xl:grid-cols-5 @8xl:grid-cols-6 gap-x-6 @3xl:gap-y-12">
                {albums.map((a, i) => (
                    <AlbumCard
                        key={i}
                        id={a.id}
                        name={a.name}
                        artists={a.artists}
                        cover={a.images[0].url}
                    />
                ))}
            </div>
        </ArtistSection>
    );
}
