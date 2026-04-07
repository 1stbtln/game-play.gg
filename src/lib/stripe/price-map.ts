export type BillingPlan = "pro" | "team";
export type BillingInterval = "monthly" | "yearly";

export function resolveStripePriceId(plan: BillingPlan, interval: BillingInterval): string | null {
    const map: Record<string, string | undefined> = {
        "pro-monthly": process.env.STRIPE_PRICE_PRO_MONTHLY,
        "pro-yearly": process.env.STRIPE_PRICE_PRO_YEARLY,
        "team-monthly": process.env.STRIPE_PRICE_TEAM_MONTHLY,
        "team-yearly": process.env.STRIPE_PRICE_TEAM_YEARLY,
    };
    return map[`${plan}-${interval}`] ?? null;
}
