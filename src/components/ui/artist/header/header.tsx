import ArtistCover, { ArtistCoverProps } from "./cover";
import ArtistHeaderContent, {
    ArtistHeaderContentProps,
} from "./header-content";

export type ArtistHeaderProps = ArtistCoverProps & ArtistHeaderContentProps;

export function ArtistHeader({
    artistCover,
    artistName,
    shadowColor,
    priority,
    ...contentProps
}: ArtistHeaderProps) {
    return (
        <header className="relative">
            <div className="flex flex-col gap-6">
                <ArtistCover
                    artistCover={artistCover}
                    artistName={artistName}
                    shadowColor={shadowColor}
                    priority={priority}
                />

                <ArtistHeaderContent
                    artistName={artistName}
                    {...contentProps}
                />
            </div>
        </header>
    );
}
