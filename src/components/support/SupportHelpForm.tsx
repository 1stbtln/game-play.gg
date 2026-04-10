"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = [
    { value: "bug", label: "Bug Report", description: "Something isn't working as expected" },
    { value: "recording", label: "Recording Issue", description: "Problems with capture, encoding, or saving" },
    { value: "engine", label: "State Engine / Detection", description: "Game detection, match tracking, or highlights" },
    { value: "performance", label: "Performance", description: "FPS drops, high CPU/memory, or freezing" },
    { value: "account", label: "Account & Login", description: "Sign-in problems, OAuth, or account access" },
    { value: "billing", label: "Billing & Subscription", description: "Charges, plan changes, or payment issues" },
    { value: "feature", label: "Feature Request", description: "Suggest an improvement or new feature" },
    { value: "other", label: "General Question", description: "Anything else not listed above" },
] as const;

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low", description: "No rush — cosmetic or minor" },
    { value: "normal", label: "Normal", description: "Affects my workflow but I can work around it" },
    { value: "high", label: "High", description: "Blocking my ability to use the app" },
] as const;

const FAQ_ITEMS: { id: string; question: string; answer: string }[] = [
    {
        id: "sub-stuck",
        question: 'The app is stuck on "Checking your subscription..."',
        answer: "This usually means the auth server is temporarily unreachable. Check your internet connection and try restarting the app. If the issue persists after a few minutes, your Supabase project may be experiencing downtime — submit a support ticket above so we can investigate.",
    },
    {
        id: "engine-error",
        question: 'The state engine shows an "error" status',
        answer: "The Python-based state engine may have crashed or failed to start. Make sure Python 3.10 or later is installed and available on your system PATH. Also confirm that port 8000 is not occupied by another application. Restarting GamePlay will attempt to relaunch the engine automatically.",
    },
    {
        id: "recording-stop",
        question: "My recording stops or finalizes immediately after starting",
        answer: "This typically happens when the capture source (window or screen) is no longer available, or when FFmpeg encounters an encoding error. Confirm your game is still running and the correct monitor is selected in Settings. You can also try switching the capture backend from DXCam to MSS (or vice-versa) under Settings.",
    },
    {
        id: "hotkeys",
        question: "Global hotkeys don't work or are unresponsive",
        answer: "Global keyboard shortcuts can conflict with other running applications or overlays. Try remapping them to different key combinations under Settings → Keybindings. Some anti-cheat software also blocks global hotkey registration — make sure GamePlay is whitelisted in your anti-cheat configuration.",
    },
    {
        id: "detection",
        question: "GamePlay doesn't detect my game or match",
        answer: "Game detection relies on the state engine analyzing your screen. Make sure the engine is armed (toggle in the top bar) and the correct monitor is selected as the capture source. If detection is still failing, the game may not yet be supported — submit a feature request and include which game and mode you're playing.",
    },
    {
        id: "audio",
        question: "My montages or clips have no audio",
        answer: "Audio capture depends on system audio routing. Ensure that your game's audio output device matches what GamePlay is monitoring. You can check and change the audio source in Settings. If you're using virtual audio cables or audio routing software, additional configuration may be needed.",
    },
    {
        id: "update",
        question: "How do I update the app?",
        answer: "Currently, updates are distributed manually. When a new version is available you'll see a notification in the app, or you can download the latest release from the GamePlay website. Auto-update support is planned for a future release.",
    },
    {
        id: "free-tier",
        question: "Can I use GamePlay without a subscription?",
        answer: "Yes. GamePlay offers a free tier that includes core recording features. A Pro subscription unlocks additional capabilities like automatic highlights, longer recording durations, and priority support. You can manage your plan from the website.",
    },
    {
        id: "uninstall",
        question: "How do I uninstall GamePlay?",
        answer: "You can uninstall GamePlay through Windows Settings → Apps → Installed apps. Your recordings and montages are stored in your local files and won't be deleted when you uninstall. Configuration files are stored in your user AppData folder if you want to remove those as well.",
    },
];

function browserPlatformInfo() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let os = "Unknown";
    if (ua.includes("Windows NT 10")) os = "Windows 10/11";
    else if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS X")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";

    return {
        os,
        userAgent: ua.slice(0, 512),
        source: "web" as const,
    };
}

type Props = {
    initialEmail?: string;
    initialUserId?: string | null;
};

export function SupportHelpForm({ initialEmail = "", initialUserId = null }: Props) {
    const info = browserPlatformInfo();

    const [email, setEmail] = useState(initialEmail);
    const [category, setCategory] = useState<string>("bug");
    const [priority, setPriority] = useState<string>("normal");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");
        setError(null);

        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    subject: subject.trim(),
                    description: description.trim(),
                    priority,
                    category,
                    userId: initialUserId,
                    systemInfo: info,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error ?? `Server responded with ${res.status}`);
            }

            setStatus("sent");
            setSubject("");
            setDescription("");
            setTimeout(() => setStatus("idle"), 6000);
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    }

    return (
        <div className="flex flex-col gap-10">
            <Card className="border-border/80 bg-card/50">
                <CardHeader>
                    <CardTitle>Submit a support ticket</CardTitle>
                    <CardDescription>Tell us what&apos;s going on and we&apos;ll get back to you by email.</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === "sent" ? (
                        <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-4 text-sm text-green-700 dark:text-green-300">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <div>
                                <p className="font-medium">Ticket submitted</p>
                                <p className="mt-1 text-muted-foreground">
                                    We&apos;ve received your request and will respond to {email} as soon as possible.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="web-support-email">Email</Label>
                                <Input
                                    id="web-support-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="web-support-category">Category</Label>
                                    <div className="relative">
                                        <select
                                            id="web-support-category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c.value} value={c.value}>
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {CATEGORIES.find((c) => c.value === category)?.description}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="web-support-priority">Priority</Label>
                                    <div className="relative">
                                        <select
                                            id="web-support-priority"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            {PRIORITY_OPTIONS.map((p) => (
                                                <option key={p.value} value={p.value}>
                                                    {p.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {PRIORITY_OPTIONS.find((p) => p.value === priority)?.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="web-support-subject">Subject</Label>
                                <Input
                                    id="web-support-subject"
                                    type="text"
                                    required
                                    maxLength={200}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief summary of your issue"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="web-support-description">Description</Label>
                                <Textarea
                                    id="web-support-description"
                                    required
                                    rows={5}
                                    maxLength={5000}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={
                                        "What happened? What did you expect?\nInclude steps to reproduce if reporting a bug."
                                    }
                                />
                            </div>

                            {error ? (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </div>
                            ) : null}

                            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Browser and OS info are included automatically to help us troubleshoot.
                                </p>
                                <Button
                                    type="submit"
                                    disabled={status === "sending" || !description.trim() || !subject.trim()}
                                >
                                    {status === "sending" ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting…
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit ticket
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            <div>
                <h2 className="text-2xl font-semibold text-center lg:text-3xl">Frequently asked questions</h2>
                <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
                    Common questions about the desktop app and your account. Still stuck? Use the form above.
                </p>
                <div className="mx-auto mt-10 max-w-3xl w-full">
                    <Accordion type="single" collapsible className="w-full">
                        {FAQ_ITEMS.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
