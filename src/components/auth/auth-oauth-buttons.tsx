"use client";

import { signInWithOAuth, type AuthFormState } from "@/actions/auth";
import { Icons } from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";

function OAuthSubmitRow() {
    const { pending } = useFormStatus();
    return (
        <div className="flex flex-col gap-2 w-full">
            <Button type="submit" name="provider" value="google" variant="outline" className="w-full gap-2" disabled={pending}>
                <Icons.google className="h-4 w-4 shrink-0" />
                Continue with Google
            </Button>
            <Button type="submit" name="provider" value="discord" variant="outline" className="w-full gap-2" disabled={pending}>
                <Icons.discord className="h-4 w-4 shrink-0" />
                Continue with Discord
            </Button>
        </div>
    );
}

type Props = {
    /** Shown above the email/password block on sign-up */
    oauthFirst?: boolean;
};

export function AuthOAuthButtons({ oauthFirst = false }: Props) {
    const [state, formAction] = useFormState(signInWithOAuth, null as AuthFormState);

    const oauthBlock = (
        <>
            {state?.error ? (
                <p className="text-sm text-destructive w-full" role="alert">
                    {state.error}
                </p>
            ) : null}
            <form action={formAction} className="flex w-full flex-col gap-2">
                <OAuthSubmitRow />
            </form>
        </>
    );

    const divider = (
        <div className="relative w-full">
            <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
        </div>
    );

    if (oauthFirst) {
        return (
            <div className="flex flex-col gap-4 w-full items-start">
                {oauthBlock}
                {divider}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full items-start">
            {divider}
            {oauthBlock}
        </div>
    );
}
