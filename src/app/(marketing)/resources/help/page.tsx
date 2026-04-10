import type { Metadata } from "next";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import MagicBadge from "@/components/ui/magic-badge";
import { SupportHelpForm } from "@/components/support/SupportHelpForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Help & Support",
    description:
        "Submit a support ticket, browse FAQs, and get help with GamePlay — the same options as in the desktop app.",
};

export default async function HelpPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <MaxWidthWrapper className="mb-40">
            <AnimationContainer delay={0.1}>
                <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-10">
                    <MagicBadge title="Support" />
                    <h1 className="mt-6 text-center text-2xl font-semibold font-heading !leading-tight md:text-4xl lg:text-5xl">
                        Help &amp; support
                    </h1>
                    <p className="mt-6 text-center text-base text-muted-foreground md:text-lg">
                        Submit a ticket, read FAQs, and get the same help you&apos;d find in the GamePlay desktop app.
                    </p>
                </div>
            </AnimationContainer>

            <AnimationContainer delay={0.15}>
                <SupportHelpForm initialEmail={user?.email ?? ""} initialUserId={user?.id ?? null} />
            </AnimationContainer>
        </MaxWidthWrapper>
    );
}
