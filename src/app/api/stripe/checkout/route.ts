import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { resolveStripePriceId, type BillingInterval, type BillingPlan } from "@/lib/stripe/price-map";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const stripe = getStripe();
    if (!stripe) {
        return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 });
    }

    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan") as BillingPlan | null;
    const interval = searchParams.get("interval") as BillingInterval | null;

    if (plan !== "pro") {
        return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    if (interval !== "monthly" && interval !== "yearly") {
        return NextResponse.json({ error: "Invalid interval." }, { status: 400 });
    }

    const priceId = resolveStripePriceId(plan, interval);
    if (!priceId) {
        return NextResponse.json(
            { error: "Price ID not configured. Set STRIPE_PRICE_* env vars." },
            { status: 501 },
        );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;

    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();

    let customerId = profile?.stripe_customer_id ?? undefined;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
        await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${siteUrl}/dashboard?checkout=success`,
        cancel_url: `${siteUrl}/pricing?checkout=cancel`,
        metadata: { supabase_user_id: user.id },
        subscription_data: {
            metadata: { supabase_user_id: user.id },
        },
    });

    if (!session.url) {
        return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
    }

    return NextResponse.redirect(session.url);
}
