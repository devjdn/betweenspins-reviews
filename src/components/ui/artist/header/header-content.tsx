import ArtistMetadata, { ArtistMetaProps } from "./metadata";
import ArtistActions, { ArtistActionsProps } from "./actions";

export type ArtistHeaderContentProps = ArtistMetaProps & ArtistActionsProps;

export default function ArtistHeaderContent({
    artistName,

    genres,

    color,
    spotifyUrl,
}: ArtistHeaderContentProps) {
    return (
        <div className="@3xl:h-3/4 flex flex-col @3xl:justify-between gap-y-8 @3xl:gap-y-4">
            <ArtistMetadata artistName={artistName} genres={genres} />

            {/* <ArtistActions color={color} spotifyUrl={spotifyUrl} /> */}
        </div>
    );
}
