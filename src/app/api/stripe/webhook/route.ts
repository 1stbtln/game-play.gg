import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function upsertSubscriptionFromStripe(sub: Stripe.Subscription) {
    const admin = createAdminClient();

    let userId = sub.metadata?.supabase_user_id ?? null;
    if (!userId) {
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (customerId) {
            const { data } = await admin.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
            userId = data?.id ?? null;
        }
    }
    if (!userId) {
        console.error("[stripe webhook] No Supabase user for subscription", sub.id);
        return;
    }

    const priceId = sub.items.data[0]?.price?.id ?? null;

    await admin.from("subscriptions").upsert(
        {
            user_id: userId,
            stripe_subscription_id: sub.id,
            stripe_price_id: priceId,
            status: sub.status,
            current_period_start: sub.current_period_start
                ? new Date(sub.current_period_start * 1000).toISOString()
                : null,
            current_period_end: sub.current_period_end
                ? new Date(sub.current_period_end * 1000).toISOString()
                : null,
            cancel_at_period_end: sub.cancel_at_period_end ?? false,
        },
        { onConflict: "stripe_subscription_id" },
    );
}

export async function POST(request: Request) {
    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !secret) {
        return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json({ error: "Missing signature." }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid payload";
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const admin = createAdminClient();

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.supabase_user_id;
                const customerId =
                    typeof session.customer === "string" ? session.customer : session.customer?.id;
                if (userId && customerId) {
                    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId);
                }
                break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const sub = event.data.object as Stripe.Subscription;
                await upsertSubscriptionFromStripe(sub);
                break;
            }
            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription;
                await admin
                    .from("subscriptions")
                    .update({ status: "canceled", cancel_at_period_end: false })
                    .eq("stripe_subscription_id", sub.id);
                break;
            }
            default:
                break;
        }
    } catch (e) {
        console.error("[stripe webhook]", e);
        return NextResponse.json({ error: "Handler failed." }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
