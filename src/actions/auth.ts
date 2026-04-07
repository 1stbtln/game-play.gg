"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthFormState = { error?: string; success?: boolean; message?: string } | null;

export async function signInWithPassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { error: error.message };
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
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
            data: { full_name: fullName },
        },
    });
    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    return {
        success: true,
        message: "Check your email for a confirmation link, then sign in.",
    };
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}
