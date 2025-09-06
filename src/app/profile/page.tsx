import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import UserBio from "@/components/ui/profile/bio";
import ColorThiefBackground from "@/components/gradients/colorthief-gradient";
import Background from "@/components/gradients/mesh";

export default async function ProfilePage() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const user = await currentUser();
    const userData = await fetchQuery(api.users.getByClerkId, {
        clerkUserId: user!.id,
    });

    return (
        <div className="space-y-12 w-full max-w-6xl mx-auto">
            {user?.imageUrl ? (
                <ColorThiefBackground imageSrc={user.imageUrl} />
            ) : (
                <Background />
            )}

            <header className="flex flex-col md:grid md:grid-cols-[auto_1fr] items-center gap-8">
                <div className="relative w-[172px] rounded-full border overflow-hidden aspect-square bg-secondary/60 backdrop-blur-md">
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
                    <div className="space-y-4">
                        <h1 className="font-semibold tracking-tight text-3xl sm:text-4xl md:text-text-5xl">
                            {user?.username}
                        </h1>

                        <div className="space-y-4">
                            <Badge variant={"secondary"}>
                                <CalendarDaysIcon />
                                Joined{" "}
                                {user?.createdAt
                                    ? new Date(
                                          user.createdAt
                                      ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })
                                    : ""}
                            </Badge>
                        </div>
                    </div>

                    {userData && <UserBio bio={userData.bio} />}
                </div>
            </header>

            <Separator />
        </div>
    );
}
