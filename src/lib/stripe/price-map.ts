export type BillingPlan = "pro";
export type BillingInterval = "monthly" | "yearly";

export function resolveStripePriceId(plan: BillingPlan, interval: BillingInterval): string | null {
    const map: Record<string, string | undefined> = {
        "pro-monthly": process.env.STRIPE_PRICE_PRO_MONTHLY,
        "pro-yearly": process.env.STRIPE_PRICE_PRO_YEARLY,
    };
    return map[`${plan}-${interval}`] ?? null;
}
