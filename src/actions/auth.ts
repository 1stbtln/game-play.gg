"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";

export type AuthFormState = { error?: string; success?: boolean; message?: string } | null;

const OAUTH_PROVIDERS = ["google", "discord"] as const satisfies readonly Provider[];

function isOAuthProvider(value: string): value is (typeof OAUTH_PROVIDERS)[number] {
    return (OAUTH_PROVIDERS as readonly string[]).includes(value);
}

function normalizeAuthError(message: string) {
    const lower = message.toLowerCase();
    if (lower.includes("user already registered")) {
        return "This email already has an account. Try signing in instead, or use password reset if needed.";
    }
    if (lower.includes("invalid login credentials")) {
        return "Invalid email or password.";
    }
    return message;
}

export async function signInWithOAuth(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const raw = String(formData.get("provider") ?? "");
    if (!isOAuthProvider(raw)) {
        return { error: "Unknown sign-in method." };
    }

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: raw,
        options: {
            redirectTo: `${siteUrl}/auth/callback`,
        },
    });

    if (error) {
        return { error: normalizeAuthError(error.message) };
    }
    if (!data.url) {
        return { error: "Could not start sign-in. Try again." };
    }

    redirect(data.url);
}

export async function signInWithPassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { error: normalizeAuthError(error.message) };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signUpWithPassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();
    if (!email || !password) {
        return { error: "Email and password are required." };
    }
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    const supabase = createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
            data: { full_name: fullName },
        },
    });
    if (error) {
        return { error: normalizeAuthError(error.message) };
    }

    revalidatePath("/", "layout");

    // Email confirmation off: Supabase returns a session; send user into the app.
    if (data.session) {
        redirect("/dashboard");
    }

    // Email confirmation on: no session yet; land on sign-in with guidance after they confirm.
    redirect("/auth/sign-in?notice=check_email");
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}
