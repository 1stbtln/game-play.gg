"use client";

import { signInWithPassword, type AuthFormState } from "@/actions/auth";
import { AuthOAuthButtons } from "@/components/auth/auth-oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
        </Button>
    );
}

const SignInForm = () => {
    const [state, formAction] = useFormState(signInWithPassword, null as AuthFormState);

    return (
        <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5">
            <h2 className="text-2xl font-semibold">Sign in to GamePlay</h2>
            <p className="text-muted-foreground text-sm">
                Use the email and password for your account. New here?{" "}
                <Link href="/auth/sign-up" className="text-primary underline-offset-4 hover:underline">
                    Create an account
                </Link>
                .
            </p>

            {state?.error ? (
                <p className="text-sm text-destructive w-full" role="alert">
                    {state.error}
                </p>
            ) : null}

            <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" autoComplete="current-password" required />
                </div>
                <SubmitButton />
            </form>

            <AuthOAuthButtons />

            <Button asChild variant="outline">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to home
                </Link>
            </Button>
        </div>
    );
};

export default SignInForm;
