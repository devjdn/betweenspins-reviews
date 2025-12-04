import type { AlbumMetaProps } from "./metadata";
import type { AlbumActionsProps } from "./actions";
import AlbumActions from "./actions";
import AlbumMetadata from "./metadata";

export type AlbumHeaderContentProps = AlbumMetaProps & AlbumActionsProps;

export default function AlbumHeaderContent({
    albumName,
    isExplicit,
    artists,
    color,
    spotifyUrl,
}: AlbumHeaderContentProps) {
    return (
        <div className="@3xl:h-3/4 flex flex-col @3xl:justify-between gap-y-8 @3xl:gap-y-4">
            <AlbumMetadata
                albumName={albumName}
                isExplicit={isExplicit}
                artists={artists}
            />

            <AlbumActions color={color} spotifyUrl={spotifyUrl} />
        </div>
    );
}
