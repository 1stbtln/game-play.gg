"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DesktopOAuthCallbackPage() {
    const [attempted, setAttempted] = useState(false);

    const deepLink = useMemo(() => {
        if (typeof window === "undefined") return "gameplay://auth/callback";
        return `gameplay://auth/callback${window.location.search}${window.location.hash}`;
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            history.replaceState(null, "", window.location.pathname);
        } catch {
            /* ignore */
        }
        window.location.replace(deepLink);
        const timer = window.setTimeout(() => setAttempted(true), 900);
        return () => window.clearTimeout(timer);
    }, [deepLink]);

    return (
        <div className="min-h-dvh w-full bg-background px-4 py-10 sm:px-6">
            <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
                <h1 className="text-lg font-semibold">{attempted ? "Return to the desktop app" : "Opening GamePlay desktop…"}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {attempted
                        ? "If GamePlay opened and you’re signed in there, you can close this browser tab. If not, use the button below."
                        : "If the app did not open automatically, use the button below when it appears. When the desktop app shows you’re signed in, you can close this tab — it does not need to stay open."}
                </p>

                {attempted ? (
                    <a
                        href={deepLink}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
                    >
                        Open GamePlay desktop
                    </a>
                ) : (
                    <p className="mt-5 text-xs text-muted-foreground">Waiting for the browser/app handoff…</p>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                    Need help? Return to{" "}
                    <Link href="/auth/sign-in" className="text-primary underline-offset-4 hover:underline">
                        sign in
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
