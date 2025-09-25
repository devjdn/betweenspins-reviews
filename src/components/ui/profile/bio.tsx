"use client";

export default function UserBio({ bio }: { bio?: string }) {
    return (
        <div className="text-sm space-y-1 max-w-prose text-balance">
            <p className="text-muted-foreground">{bio}</p>
        </div>
    );
}
