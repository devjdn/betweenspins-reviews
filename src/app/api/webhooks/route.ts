import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);
        const { type, data } = evt;

        switch (type) {
            case "user.created": {
                const client = await clerkClient();

                await fetchMutation(api.users.create, {
                    clerkUserId: data.id,
                    bio: "",
                    favoriteArtists: [],
                });

                await client.users.updateUser(data.id, {
                    publicMetadata: {
                        onboardingStatus: "not_started",
                    },
                });
                break;
            }

            case "user.deleted": {
                await fetchMutation(api.users.remove, {
                    clerkUserId: data.id!,
                });
                break;
            }

            default:
                // Ignore unhandled event types for now
                break;
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}
