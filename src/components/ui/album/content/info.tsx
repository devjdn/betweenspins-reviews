type InfoProps = {
    runtime: string;
    totalTracks: number;
    genres: string[];
    averageRating: number;
    reviewCount: number;
}

export default function AlbumInfo({ runtime, totalTracks, genres, averageRating = 0.0, reviewCount = 0 }: InfoProps) {
    return (
        <div className="*:border-b *:py-2 *:space-y-1">
            <div className="*:text-sm">
                <h3 className="font-medium text-foreground">Runtime</h3>
                <p className="text-muted-foreground">{runtime}</p>
            </div>
            <div className="*:text-sm">
                <h3 className="font-medium text-foreground">Total Tracks</h3>
                <p className="text-muted-foreground">{totalTracks}</p>
            </div>
            <div className="*:text-sm">
                <h3 className="font-medium text-foreground">Genres</h3>
                <p className="text-muted-foreground capitalize">{genres.join(", ")}</p>
            </div>
            <div className="*:text-sm">
                <h3 className="font-medium text-foreground">Average Rating</h3>
                <p className="text-muted-foreground">{averageRating}</p>
            </div>
            <div className="*:text-sm">
                <h3 className="font-medium text-foreground">Review Count</h3>
                <p className="text-muted-foreground">{reviewCount}</p>
            </div>
        </div>
    );
}