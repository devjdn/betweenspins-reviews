"use client";

export default function UserBio({ bio }: { bio?: string }) {
    return (
        <div className="max-w-lg">
            <p className="text-muted-foreground text-sm">{bio}</p>
        </div>
    );
}
