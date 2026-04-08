import { getStripe } from "@/lib/stripe/client";
import { resolveStripePriceId } from "@/lib/stripe/price-map";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const stripe = getStripe();
    if (!stripe) {
        return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 });
    }

    const monthlyId = resolveStripePriceId("pro", "monthly");
    const yearlyId = resolveStripePriceId("pro", "yearly");
    if (!monthlyId || !yearlyId) {
        return NextResponse.json({ error: "Missing STRIPE_PRICE_PRO_* env vars." }, { status: 501 });
    }

    const [monthly, yearly] = await Promise.all([
        stripe.prices.retrieve(monthlyId),
        stripe.prices.retrieve(yearlyId),
    ]);

    return NextResponse.json({
        pro: {
            monthly: {
                unit_amount: monthly.unit_amount,
                currency: monthly.currency,
                id: monthly.id,
            },
            yearly: {
                unit_amount: yearly.unit_amount,
                currency: yearly.currency,
                id: yearly.id,
            },
        },
    });
}

