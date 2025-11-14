export default function Loading() {
    return (
        <div className="@container space-y-4 w-full animate-pulse">
            <header className="py-6 px-4 @3xl:px-6 md:rounded-xl bg-muted">
                <div className="flex flex-col gap-6 @3xl:grid @3xl:grid-cols-[256px_1fr] items-center @3xl:items-end">
                    {/* Album image placeholder */}
                    <div className="w-80 @3xl:w-auto relative aspect-square rounded-md overflow-hidden bg-secondary shadow-md @3xl:shadow-2xl" />

                    {/* Right-side content */}
                    <div className="space-y-4 @3xl:space-y-8 w-full">
                        <div className="space-y-4">
                            {/* Album title + artist names */}
                            <div className="space-y-2 text-center @3xl:text-left">
                                <div className="h-7 @3xl:h-9 bg-secondary/50 rounded-md w-3/4 mx-auto @3xl:mx-0" />
                                <div className="h-6 @3xl:h-7 bg-secondary/40 rounded-md w-1/2 mx-auto @3xl:mx-0" />
                            </div>

                            {/* Meta info: rating, year, type */}
                            <div className="flex items-center justify-center @3xl:justify-start gap-3 text-sm mt-3">
                                <div className="h-4 bg-secondary/40 rounded w-16" />
                                <div className="h-4 bg-secondary/40 rounded w-4" />
                                <div className="h-4 bg-secondary/40 rounded w-10" />
                                <div className="h-4 bg-secondary/40 rounded w-4" />
                                <div className="h-4 bg-secondary/40 rounded w-16" />
                            </div>
                        </div>

                        {/* Spotify button placeholder */}
                        <div className="w-full mx-auto @3xl:mx-0">
                            <div className="h-11 rounded-full bg-secondary/50 w-full @3xl:w-52" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs skeleton */}
            <section className="px-4 md:px-6">
                <div className="">
                    <div className="flex gap-2 mb-4">
                        <div className="h-8 bg-secondary/40 rounded-full w-20" />
                        <div className="h-8 bg-secondary/40 rounded-full w-24" />
                        <div className="h-8 bg-secondary/40 rounded-full w-28" />
                    </div>
                    <div className="h-64 bg-secondary/30 rounded-lg" />
                </div>
            </section>
        </div>
    );
}
