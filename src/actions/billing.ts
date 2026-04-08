"use server";

import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function openBillingPortal() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/sign-in");
    }

    const stripe = getStripe();
    if (!stripe) {
        redirect("/pricing?billing=unavailable");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .maybeSingle();

    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
        redirect("/pricing?billing=setup");
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${siteUrl}/pricing`,
    });

    redirect(session.url);
}

