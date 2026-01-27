import { auth, currentUser } from "@clerk/nextjs/server";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const { redirectToSignIn } = await auth();

    const user = await currentUser();
    const userData = await fetchQuery(api.users.getByClerkId, {
        clerkUserId: user!.id,
    });

    if (user) {
        return (
            <div className="space-y-8 max-w-7xl w-full mx-auto px-4 md:px-8">
                <header className="space-y-12">
                    <div className="w-full mx-auto flex flex-col gap-6 md:grid md:grid-cols-[172px_1fr] items-center md:items-end">
                        <div className="w-64 md:w-auto relative aspect-square shadow-lg rounded-full md:shadow-2xl overflow-hidden bg-secondary">
                            <Image
                                src={user.imageUrl}
                                alt={`${user.username}'s Profile Picture`}
                                className="object-cover"
                                fill
                                priority
                            />
                        </div>

                        <div className="flex flex-col gap-y-4 items-center md:items-start">
                            <div className="md:space-y-1 text-center md:text-left md:tracking-tight">
                                <h1 className="font-medium md:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                                    {user.fullName ?? user.username}
                                </h1>
                                <p className="text-muted-foreground">{`@${user.username}`}</p>
                            </div>

                            <Button size={"sm"}>
                                <Pencil />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                    {userData && userData.bio && (
                        <div className="text-sm space-y-1">
                            <h3 className="font-medium md:text-lg">About</h3>
                            <p className="text-muted-foreground">
                                {userData.bio}
                            </p>
                        </div>
                    )}
                </header>
            </div>
        );
    } else {
        redirectToSignIn();
    }
}
