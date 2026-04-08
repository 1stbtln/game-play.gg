import { AnimationContainer, MaxWidthWrapper, PricingCards } from "@/components";
import { AppWorkflowBeam } from "@/components/ui/app-workflow-beam";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { createClient } from "@/lib/supabase/server";
import { REVIEWS } from "@/utils/constants/misc";
import { ArrowRightIcon, CreditCardIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

    return (
        <div className="overflow-x-hidden scrollbar-hide size-full">
            {/* Hero Section */}
            <MaxWidthWrapper>
                <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
                    <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
                        <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                            <span>
                                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                            </span>
                            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                            <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
                            <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1">
                                Windows desktop app
                                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </span>
                        </button>
                        <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
                            Record. Clip. <span className="text-transparent bg-gradient-to-r from-[rgba(96,165,250,0.9)] to-[rgba(52,211,153,0.9)] bg-clip-text inline-bloc">
                                Share.
                            </span>
                        </h1>
                        <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
                            GamePlay records your gameplay and creates highlight montages automatically.
                            <br className="hidden md:block" />
                            <span className="hidden md:block">One app for capture, clips, and sharing. Built for Windows.</span>
                        </p>
                        <div className="flex flex-col items-center gap-3 z-50">
                            <Button asChild>
                                <Link href={isAuthenticated ? "/pricing" : "/auth/sign-up"} className="flex items-center">
                                    {isAuthenticated ? "View plans" : "Try it for free"}
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <p className="text-xs text-muted-foreground font-medium tracking-wide">
                                Lightweight • Local storage • No cloud required
                            </p>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer delay={0.2} className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full">
                        <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
                        <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
                            <BorderBeam
                                size={250}
                                duration={12}
                                delay={9}
                            />
                            <Image
                                src="/assets/Screenshot 2026-03-11 153203.png"
                                alt="GamePlay desktop app — recording and montages"
                                width={1200}
                                height={1200}
                                quality={100}
                                className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
                            />
                            <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
                            <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
                        </div>
                    </AnimationContainer>
                </div>
            </MaxWidthWrapper >

            {/* Process Section */}
            <MaxWidthWrapper className="py-10">
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="The Process" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            What happens after you press start
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            GamePlay runs this flow automatically in the background so your full session becomes clean clips and a ready-to-share highlight reel.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <div className="py-8">
                        <AppWorkflowBeam />
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.25}>
                    <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto pb-6">
                        The state engine drives the session: it branches to recording and highlight inference in parallel, each path loops back for the next transition, then the
                        engine hands off to montage export when you are ready for a finished montage.
                    </p>
                </AnimationContainer>
                <AnimationContainer delay={0.3}>
                    <MagicCard className="w-full max-w-none">
                        <div className="p-6 md:p-7">
                            <Accordion type="single" collapsible defaultValue="step-1" className="w-full">
                                <AccordionItem value="step-1">
                                    <AccordionTrigger className="text-left text-foreground">1) Turn it on</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm font-medium text-foreground">You do: Press Start.</p>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Electron creates a new session and bootstraps the local state engine service on <span className="text-foreground">127.0.0.1:8000</span>.
                                            Health checks and session controls run over HTTP, while live state is streamed over <span className="text-foreground">/ws</span>.
                                        </p>
                                        <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc pl-5">
                                            <li>Desktop shell handles UI, shortcuts, settings, and file orchestration.</li>
                                            <li>Python service handles CV inference and state event generation.</li>
                                            <li>Local-first runtime keeps core flow private and offline-friendly.</li>
                                        </ul>
                                        <p className="mt-3 text-xs text-muted-foreground">Result: Session is live.</p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="step-2">
                                    <AccordionTrigger className="text-left text-foreground">2) State engine runs continuously</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm font-medium text-foreground">GamePlay does: Detect and confirm state transitions.</p>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            The engine captures a configured monitor region, preprocesses frames, runs YOLO classification, and applies a stability gate
                                            (confidence + consecutive frames) so noisy flips do not trigger false transitions.
                                        </p>
                                        <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc pl-5">
                                            <li>Capture fallback path: <span className="text-foreground">dxcam -&gt; mss</span> for better reliability on Windows systems.</li>
                                            <li>Emits <span className="text-foreground">state_update</span>, <span className="text-foreground">state_transition</span>, perf metrics, and optional preview JPEG frames.</li>
                                            <li>Uses bounded queues/backpressure patterns to keep UI responsiveness stable.</li>
                                        </ul>
                                        <p className="mt-3 text-xs text-muted-foreground">Result: Reliable live state.</p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="step-3">
                                    <AccordionTrigger className="text-left text-foreground">3) Recording starts and stops automatically</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm font-medium text-foreground">GamePlay does: Start/stop recording at the right moments.</p>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Recording automation listens for stable transitions. On <span className="text-foreground">inactive -&gt; active</span> it starts FFmpeg;
                                            on <span className="text-foreground">active -&gt; inactive</span> it finalizes, validates with ffprobe, and returns to the state loop.
                                        </p>
                                        <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc pl-5">
                                            <li>Writes per-match metadata such as <span className="text-foreground">match.json</span>.</li>
                                            <li>Stores artifacts under user-data recording session/match folders.</li>
                                            <li>Updates the recordings list in the desktop UI automatically.</li>
                                        </ul>
                                        <p className="mt-3 text-xs text-muted-foreground">Result: Clean match clips.</p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="step-4">
                                    <AccordionTrigger className="text-left text-foreground">4) Highlight inference scores each moment</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm font-medium text-foreground">GamePlay does: Rank the best plays.</p>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Inference reads cached highlight scores when possible. If missing, it samples frames and runs ONNX scoring to build ranked highlight
                                            segments while the state loop continues driving capture and transitions.
                                        </p>
                                        <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc pl-5">
                                            <li>Fallback chain: <span className="text-foreground">Python inference -&gt; Node fallback -&gt; in-process fallback</span>.</li>
                                            <li>Keeps processing resilient if one runtime path is unavailable.</li>
                                            <li>Produces ranked segments used by montage composition.</li>
                                        </ul>
                                        <p className="mt-3 text-xs text-muted-foreground">Result: Ranked highlight segments.</p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="step-5">
                                    <AccordionTrigger className="text-left text-foreground">5) Montage export packages everything</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm font-medium text-foreground">You get: One shareable highlight reel.</p>
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            After recording and inference complete their loop through the state engine, top-ranked segments are concatenated into a final montage
                                            MP4 and written with export metadata for review, re-export, or immediate sharing.
                                        </p>
                                        <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc pl-5">
                                            <li>Output includes montage media and <span className="text-foreground">montage_meta.json</span>.</li>
                                            <li>Flow is local-first: no cloud backend required for the core pipeline.</li>
                                            <li>Designed to scale to additional games/presets without changing the architecture.</li>
                                        </ul>
                                        <p className="mt-3 text-xs text-muted-foreground">Result: Montage ready to post.</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </MagicCard>
                </AnimationContainer>
            </MaxWidthWrapper>

            {/* Pricing Section */}
            <MaxWidthWrapper className="py-10">
                <div id="pricing" className="scroll-mt-20" />
                <AnimationContainer delay={0.1}>
                    <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
                        <MagicBadge title="Simple Pricing" />
                        <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
                            Choose a plan that works for you
                        </h2>
                        <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
                            Download free to start recording. Upgrade to Pro for auto montages and priority support.
                        </p>
                    </div>
                </AnimationContainer>
                <AnimationContainer delay={0.2}>
                    <PricingCards />
                </AnimationContainer>
                <AnimationContainer delay={0.3}>
                        <div className="flex flex-wrap items-start md:items-center justify-center lg:justify-evenly gap-6 mt-12 max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-2">
                            <CreditCardIcon className="w-5 h-5 text-foreground" />
                            <span className="text-muted-foreground">
                                Free to download • No credit card required for Free plan
                            </span>
                        </div>
                    </div>
                </AnimationContainer>
            </MaxWidthWrapper>

            
            {/* CTA Section */}
            <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
                <AnimationContainer delay={0.1}>
                    <LampContainer>
                        <div className="flex flex-col items-center justify-center relative w-full text-center">
                            <h2 className="bg-gradient-to-b from-neutral-200 to-neutral-400 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                                Ready to record and clip?
                            </h2>
                            <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                                Download GamePlay for Windows. Full session captures, generated highlight reels, and local storage—no cloud required.
                            </p>
                            <div className="mt-6 flex flex-col items-center gap-2">
                                <Button asChild>
                                    <Link href={isAuthenticated ? "/api/stripe/portal" : "/auth/sign-up"}>
                                        {isAuthenticated ? "Manage billing" : "Download for Windows"}
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <p className="text-xs text-muted-foreground/80">Lightweight • Native • Your data stays local</p>
                            </div>
                        </div>
                    </LampContainer>
                </AnimationContainer>
            </MaxWidthWrapper>

        </div>
    )
};

export default HomePage
