import ShaderBackground from "@/components/gradients/mesh";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const { userId } = await auth();
    return (
        <div className="space-y-16">
            <ShaderBackground />
            {userId ? (
                <></>
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
                        <Button variant={"default"} size={"lg"} asChild>
                            <Link href={"/sign-up"}>{"Get Started"}</Link>
                        </Button>
                        <Button variant={"outline"} size={"lg"} asChild>
                            <Link href={"/sign-in"}>{"Continue"}</Link>
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
}
