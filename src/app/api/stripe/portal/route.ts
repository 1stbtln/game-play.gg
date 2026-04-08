import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
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

    if (!user) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .maybeSingle();

    const customerId = profile?.stripe_customer_id;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;
    if (!customerId) {
        return NextResponse.redirect(`${siteUrl}/pricing?billing=setup`);
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${siteUrl}/pricing`,
    });

    return NextResponse.redirect(session.url);
}

