import Image from "next/image";

export type CoverProps = {
    albumCover: string | null;
    albumName: string;
    shadowColor?: string;
    priority?: boolean;
};

export default function AlbumCover({
    albumCover,
    albumName,
    shadowColor,
    priority = false,
}: CoverProps) {
    return (
        <div
            className="w-80 mx-auto @3xl:mx-0 @3xl:w-auto relative aspect-square rounded-lg overflow-hidden bg-secondary"
            style={{
                boxShadow: shadowColor
                    ? `0 25px 70px ${shadowColor}`
                    : undefined,
            }}
        >
            {albumCover && (
                <Image
                    src={albumCover}
                    alt={`${albumName} Album Cover`}
                    fill
                    priority={priority}
                    sizes="(min-width: 1536px) 320px, 80vw"
                    className="object-cover"
                    unoptimized
                />
            )}

            <div className="absolute inset-0 pointer-events-none rounded-lg inset-shadow-media" />
        </div>
    );
}
