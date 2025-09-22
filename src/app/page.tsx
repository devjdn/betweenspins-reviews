import Background from "@/components/gradients/mesh";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
    let user = null;

    try {
        user = await currentUser();
    } catch (err: any) {
        // If Clerk says "Not Found" (account deleted), redirect them
        if (err?.status === 404 || err?.message?.includes("Not Found")) {
            redirect("/sign-up");
        }
        throw err; // rethrow anything else
    }

    return (
        <div className="space-y-16">
            <Background />

            {user ? (
                <div className="w-11/12 mx-auto">
                    <section>
                        <div className="space-y-4 text-left">
                            <h1 className="font-sans font-semibold tracking-tight text-3xl sm:text-4xl md:text-text-5xl">
                                <span className="text-foreground/80">
                                    Welcome back,
                                </span>{" "}
                                {user.username}!
                            </h1>
                        </div>
                    </section>
                </div>
            ) : (
                <section className="flex flex-col items-center gap-6">
                    <div className="space-y-4 text-center mx-auto">
                        <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl">
                            Rate, Review, Discover.
                        </h1>
                        <p className="text-base md:text-lg tracking-tight leading-snug font-medium max-w-lg mx-auto text-muted-foreground">
                            Build your music journal, rate and review albums,
                            and discover new music from likeminded listeners.
                        </p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button variant="default" size="lg" asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/sign-in">Continue</Link>
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}
