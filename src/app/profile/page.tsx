import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";

export default async function ProfilePage() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
    const user = await currentUser();
    const userData = await fetchQuery(api.users.getByClerkId, {
        clerkUserId: user!.id,
    });

    console.log(userData);

    return (
        <div className="space-y-12 w-full max-w-6xl mx-auto">
            <header className="flex flex-col md:grid md:grid-cols-[160px_1fr] gap-12 md:items-center">
                <div className="relative rounded-full border overflow-hidden aspect-square bg-secondary/60 backdrop-blur-md">
                    {user?.imageUrl && (
                        <Image
                            src={user?.imageUrl}
                            alt={`${user.username}'s Profile Picture`}
                            fill
                            priority
                        />
                    )}
                </div>
                <div className="flex flex-col gap-8">
                    <h1 className="font-serif text-4xl md:text-text-5xl">
                        {`${user?.username}`}
                    </h1>

                    {userData!.bio}

                    <div className="space-y-4">
                        <span className="flex gap-1 items-center text-sm stroke-muted-foreground text-muted-foreground">
                            <CalendarDaysIcon className="size-4" />
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
                        </span>
                    </div>
                </div>
            </header>

            <Separator />
        </div>
    );
}
