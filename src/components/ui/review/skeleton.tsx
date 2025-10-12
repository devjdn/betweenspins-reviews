import { Skeleton } from "@/components/ui/skeleton";

export function ReviewFormSkeleton() {
    return (
        <div className="w-full max-w-4xl space-y-8 p-6">
            {/* Rating Section */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-16" />
                <div className="space-y-2">
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="flex justify-between">
                        {Array.from({ length: 11 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-4" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Title Section */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-12" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-4 w-8 ml-auto" />
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-20" />
                <div className="space-y-2">
                    <Skeleton className="h-48 w-full rounded-md" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                </div>
            </div>

            {/* Submit Button */}
            <Skeleton className="h-12 w-32 rounded-full" />
        </div>
    );
}
