import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);
        const { type, data } = evt;

        if (type === "user.created") {
            await fetchMutation(api.users.create, {
                clerkUserId: data.id,
                bio: "",
                favoriteArtists: [],
            });
        }

        if (type === "user.deleted") {
            await fetchMutation(api.users.remove, {
                clerkUserId: data.id!,
            });
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}
