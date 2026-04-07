"use server";

import { createClient } from "@/lib/supabase/server";

export type AuthUserPayload = {
    user: {
        id: string;
        email?: string;
    } | null;
    profile: {
        full_name: string | null;
        stripe_customer_id: string | null;
    } | null;
    subscription: {
        status: string;
        current_period_end: string | null;
    } | null;
};

const getAuthStatus = async (): Promise<AuthUserPayload | { error: string }> => {
    try {
        const supabase = createClient();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                user: null,
                profile: null,
                subscription: null,
            };
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, stripe_customer_id")
            .eq("id", user.id)
            .maybeSingle();

        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("status, current_period_end")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        return {
            user: { id: user.id, email: user.email ?? undefined },
            profile: profile ?? null,
            subscription: subscription ?? null,
        };
    } catch {
        return { error: "Auth is not configured. Set Supabase env vars." };
    }
};

export default getAuthStatus;
