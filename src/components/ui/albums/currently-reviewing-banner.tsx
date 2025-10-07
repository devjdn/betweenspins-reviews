import Image from "next/image";

interface CurrentlyReviewingBannerProps {
    album: {
        id: string;
        name: string;
        imageUrl: string;
        artists: {
            id: string;
            name: string;
        }[];
    };
}

export default function CurrentlyReviewingBanner({
    album,
}: CurrentlyReviewingBannerProps) {
    return (
        <div className="h-fit p-2 bg-muted rounded-lg grid grid-cols-[40px_1fr] gap-x-2">
            <div className="w-full relative aspect-square rounded-sm overflow-hidden bg-muted">
                <Image
                    src={album.imageUrl}
                    alt={`${album.name} Album Cover`}
                    fill
                    loading="lazy"
                />
            </div>
            <div className="text-sm font-normal truncate">
                <p className="">{album.name}</p>
                <p className="text-muted-foreground">
                    {album.artists.map((a) => a.name).join(", ")}
                </p>
            </div>
        </div>
    );
}
