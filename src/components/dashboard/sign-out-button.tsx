"use client";

import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
    return (
        <form action={signOut}>
            <Button type="submit" variant="outline">
                Sign out
            </Button>
        </form>
    );
}
