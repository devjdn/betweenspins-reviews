import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import UserBio from "@/components/ui/profile/bio";
import { formatFollowers, SpotifyAPI } from "@/lib/spotify";
import { SpotifyArtist } from "@/types/spotify";

export default async function ProfilePage() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

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

    console.log(favouriteArtists);

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto">
            <header className="flex flex-col md:grid md:grid-cols-[auto_1fr] items-center gap-6 md:gap-8">
                <div className="relative w-32 md:w-3xs rounded-full border overflow-hidden aspect-square bg-secondary/60 backdrop-blur-md">
                    {user?.imageUrl && (
                        <Image
                            src={user.imageUrl}
                            alt={`${user.username}'s Profile Picture`}
                            fill
                            priority
                        />
                    )}
                </div>

                <div className="flex flex-col gap-4 items-center md:items-start md:justify-between">
                    <h1 className="font-semibold tracking-tight text-xl md:text-3xl">
                        {user?.username}
                    </h1>

                    <div className="space-y-4">
                        <Badge variant={"secondary"}>
                            <CalendarDaysIcon />
                            Joined{" "}
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      }
                                  )
                                : ""}
                        </Badge>
                    </div>

                    {userData && <UserBio bio={userData.bio} />}
                </div>
            </header>

            <Separator />

            <section className="space-y-4">
                <div className="md:pl-4">
                    <h2 className="font-semibold tracking-tight text-xl sm:text-2xl md:text-text-3xl">
                        Favourite Artists
                    </h2>
                </div>

                <div className="flex overflow-x-auto gap-6 md:gap-0 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 snap-x snap-mandatory">
                    {favouriteArtists.length > 0 &&
                        favouriteArtists.map((artist, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-32 py-4 md:px-4 md:w-auto space-y-2 snap-start rounded-2xl md:hover:bg-secondary transition-colors duration-200"
                            >
                                <div className="relative aspect-square rounded-md md:rounded-lg overflow-hidden">
                                    <Image
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="leading-snug text-xs md:text-sm text-left">
                                    <p className="truncate">{artist.name}</p>
                                    <p className="text-muted-foreground/80">
                                        {`${formatFollowers(
                                            artist.followers.total
                                        )} followers`}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}
