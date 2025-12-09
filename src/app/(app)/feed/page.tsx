import ShaderColorUpdater from "@/components/shaders/shader-updater";
import { currentUser } from "@clerk/nextjs/server";

export default async function FeedPage() {
    const user = await currentUser();

    return (
        <>
            <div>
                <header>
                    <h1 className="font-display text-3xl font-semibold">
                        Feed
                    </h1>
                </header>
            </div>
            <ShaderColorUpdater />
        </>
    );
}
