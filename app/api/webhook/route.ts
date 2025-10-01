import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {

    const signature = (await headers()).get("Stripe-Signature") as string;
    const body = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.log("Error", err);
        return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
    }


    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;

    if (event.type === "checkout.session.completed") {
        if (!courseId || !userId) {
            return new Response("Missing metadata", { status: 400 });
        }
       await db.purchase.create({
            data: {
                userId,
                courseId
            }
        });

    } else {
        return new NextResponse("Unhandled event type", { status: 200 });
    }

    return new NextResponse("Success", { status: 200 });

}