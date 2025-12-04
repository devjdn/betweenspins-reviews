import { SpotifyAlbum } from "@/types/spotify";
import AlbumCover, { CoverProps } from "./cover";
import AlbumHeaderContent, { AlbumHeaderContentProps } from "./header-content";

export type AlbumHeaderProps = CoverProps & AlbumHeaderContentProps;

export function AlbumHeader({
    albumCover,
    albumName,
    shadowColor,
    priority,
    ...contentProps
}: AlbumHeaderProps) {
    return (
        <header className="relative">
            <div className="flex flex-col gap-6 @3xl:grid @3xl:grid-cols-[256px_1fr] @3xl:items-end">
                <AlbumCover
                    albumCover={albumCover}
                    albumName={albumName}
                    shadowColor={shadowColor}
                    priority={priority}
                />

                <AlbumHeaderContent albumName={albumName} {...contentProps} />
            </div>
        </header>
    );
}
