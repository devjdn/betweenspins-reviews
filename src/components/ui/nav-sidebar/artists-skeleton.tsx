import { Skeleton } from "@/components/ui/skeleton";

export function FavouriteArtistsSkeleton() {
    return (
        <div>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 rounded-md w-full px-4 h-10"
                >
                    <div className="aspect-square size-6 rounded-full overflow-hidden">
                        <Skeleton className="w-full h-full rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-32 rounded-sm" />
                </div>
            ))}
        </div>
    );
}
