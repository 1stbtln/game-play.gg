import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Accept, Content-Type, X-Gameplay-Client",
    "Access-Control-Max-Age": "86400",
};

function wantsJsonResponse(request: Request) {
    return (
        request.headers.get("accept")?.includes("application/json") === true ||
        request.headers.get("x-gameplay-client") === "desktop"
    );
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
    const stripe = getStripe();
    if (!stripe) {
        return NextResponse.json({ error: "Stripe is not configured." }, { status: 501, headers: CORS_HEADERS });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;
    const jsonMode = wantsJsonResponse(request);

    const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? null;

    let supabase: SupabaseClient;
    let userId: string;

    if (bearer) {
        supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: { Authorization: `Bearer ${bearer}` },
                },
            },
        );
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        if (error || !user) {
            if (jsonMode) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
            }
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }
        userId = user.id;
    } else {
        const serverClient = createClient();
        const {
            data: { user },
        } = await serverClient.auth.getUser();
        if (!user) {
            if (jsonMode) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
            }
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }
        supabase = serverClient as unknown as SupabaseClient;
        userId = user.id;
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", userId)
        .maybeSingle();

    const customerId = profile?.stripe_customer_id;

    if (!customerId) {
        const pricingUrl = `${siteUrl}/pricing?billing=setup`;
        if (jsonMode) {
            return NextResponse.json(
                { error: "no_customer", message: "No Stripe customer on file.", pricingUrl },
                { status: 400, headers: CORS_HEADERS },
            );
        }
        return NextResponse.redirect(pricingUrl);
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${siteUrl}/pricing`,
    });

    if (jsonMode) {
        return NextResponse.json({ url: portalSession.url }, { headers: CORS_HEADERS });
    }

    return NextResponse.redirect(portalSession.url);
}
