import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status, current_period_end, stripe_price_id")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    const subLabel =
        subscription?.status === "active" || subscription?.status === "trialing"
            ? `Active (${subscription.status})`
            : subscription
              ? subscription.status
              : "No subscription";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-xl font-medium">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-center">
                Signed in as <span className="text-foreground">{user?.email}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">Billing: {subLabel}</p>
            {subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground mt-1">
                    Current period ends{" "}
                    {new Date(subscription.current_period_end).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                    })}
                </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <Button asChild variant="primary">
                    <Link href="/pricing">Plans &amp; checkout</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">Back to home</Link>
                </Button>
                <SignOutButton />
            </div>
        </div>
    );
}
