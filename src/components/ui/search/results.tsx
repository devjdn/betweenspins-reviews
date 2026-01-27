import { SearchAlbum, SearchArtist } from "@/types/spotify";
import AlbumCard from "../music/card";

type SearchResultsProps = {
    artists: SearchArtist[];
    albums: SearchAlbum[];
};

export default function SearchResults({ artists, albums }: SearchResultsProps) {
    return (
        <div className="space-y-12">
            <section className="space-y-4">
                <div>
                    <h2 className="font-display font-medium text-xl @3xl:text-2xl">Albums</h2>
                </div>
                <div className="grid grid-cols-2 gap-y-6 @3xl:grid-cols-3 @4xl:grid-cols-4 @7xl:grid-cols-5 @8xl:grid-cols-6 gap-x-4 @3xl:gap-y-12">
                {albums.map((a, i) => (
                <AlbumCard key={i} id={a.id} name={a.name} artists={a.artists} cover={a.image.url}/>
                ))}
            </div>
            </section>
        </div>
    );
}
