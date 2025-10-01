import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarDaysIcon, Music2, Pencil, User } from "lucide-react";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import UserBio from "@/components/ui/profile/bio";
import { formatFollowers, SpotifyAPI } from "@/lib/spotify";
import { SpotifyArtist } from "@/types/spotify";
import { Button } from "@/components/ui/button";
import ArtistColorsBackground from "@/components/gradients/colorthief-gradient";

export default async function ProfilePage() {
    const { redirectToSignIn } = await auth();

    const user = await currentUser();
    const userData = await fetchQuery(api.users.getByClerkId, {
        clerkUserId: user!.id,
    });

    let favouriteArtists: SpotifyArtist[] = [];

    if (userData?.favoriteArtists && userData.favoriteArtists.length > 0) {
        try {
            favouriteArtists = await SpotifyAPI.getArtists(
                userData.favoriteArtists.map((artist) => artist.artist_id)
            );
        } catch (error) {
            console.error("Failed to fetch favorite artists:", error);
        }
    }

    const artistImgs = favouriteArtists
        .map((artist) => artist.images?.[0]?.url)
        .filter(Boolean) as string[];

    if (user) {
        return (
            <div className="space-y-8 max-w-5xl w-full mx-auto pt-24 md:pt-32 px-4 md:px-8">
                <ArtistColorsBackground imageSrcs={artistImgs} />
                <header className="space-y-12">
                    <div className="flex flex-col items-center md:flex-row gap-4 md:gap-6 md:items-end">
                        <div className="relative rounded-full aspect-square overflow-hidden border w-32 md:w-48 shadow-xl">
                            <Image
                                src={user.imageUrl}
                                alt={`${user.username}'s Profile Picture`}
                                className="object-cover"
                                fill
                                priority
                            />
                        </div>

                        <div className="flex flex-col gap-y-4 items-center md:items-start">
                            <div className="md:space-y-1 font-semibold text-center md:text-left tracking-tight">
                                <h1 className=" text-xl md:text-3xl">
                                    {user.fullName ?? user.username}
                                </h1>
                                <p className="text-muted-foreground text-lg">{`@${user.username}`}</p>
                            </div>

                            <Button size={"sm"}>
                                <Pencil />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                    {userData && (
                        <div className="space-y-12">
                            {userData.bio && (
                                <div className="text-sm space-y-1">
                                    <h3 className="font-medium md:text-lg">
                                        About
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {userData.bio}
                                    </p>
                                </div>
                            )}
                            {favouriteArtists &&
                                favouriteArtists.length > 0 && (
                                    <div className="text-sm space-y-4 p-4 md:p-8 rounded-lg md:rounded-2xl bg-card/40 backdrop-blur-2xl backdrop-saturate-100">
                                        <h3 className="font-medium md:text-lg">
                                            Favourite Artists
                                        </h3>
                                        <div className="flex overflow-x-scroll snap-x snap-mandatory gap-4 md:gap-8 md:grid md:grid-cols-5">
                                            {favouriteArtists.map(
                                                (artist, i) => (
                                                    <div
                                                        className="snap-start space-y-2"
                                                        key={i}
                                                    >
                                                        <div className="w-32 md:w-auto relative overflow-hidden rounded-full aspect-square bg-secondary grid">
                                                            {artist.images[0]
                                                                .url ? (
                                                                <Image
                                                                    src={
                                                                        artist
                                                                            .images[0]
                                                                            .url
                                                                    }
                                                                    alt={`${artist.name}'s Spotify Profile Picture`}
                                                                    fill
                                                                    loading="lazy"
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <Music2 className="size-4 place-self-center" />
                                                            )}
                                                        </div>
                                                        <div className="text-center text-xs md:text-sm">
                                                            <p className="line-clamp-2">
                                                                {artist.name}
                                                            </p>
                                                            <p className="text-muted-foreground">{`${formatFollowers(
                                                                artist.followers
                                                                    .total
                                                            )} Followers`}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </header>
            </div>
        );
    } else {
        redirectToSignIn();
    }
}
