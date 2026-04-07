"use client";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/utils";
import {
    BrainCircuitIcon,
    CameraIcon,
    ClapperboardIcon,
    FilmIcon,
    PowerIcon,
} from "lucide-react";
import React, { forwardRef, useRef } from "react";

const Node = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
    function Node({ className, children }, ref) {
        return (
            <div
                ref={ref}
                className={cn(
                    "z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-background p-2 shadow-sm",
                    className,
                )}
            >
                {children}
            </div>
        );
    },
);

export function AppWorkflowBeam({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const powerOnRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<HTMLDivElement>(null);
    const recordingRef = useRef<HTMLDivElement>(null);
    const inferenceRef = useRef<HTMLDivElement>(null);
    const montageRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card/25 p-6 md:p-8 shadow-sm",
                className,
            )}
        >
            {/* Turn on | State engine | Recording + Inference (parallel) | Montage */}
            <div className="relative z-10 flex w-full max-w-5xl flex-col items-stretch gap-8 md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Node ref={powerOnRef} className="relative h-14 w-14">
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background text-[10px] font-semibold text-foreground">
                            1
                        </span>
                        <PowerIcon className="h-7 w-7 text-foreground" />
                    </Node>
                    <p className="text-center text-xs text-muted-foreground">Turn it on</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <Node ref={engineRef} className="relative h-14 w-14">
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background text-[10px] font-semibold text-foreground">
                            2
                        </span>
                        <CameraIcon className="h-6 w-6 text-foreground" />
                    </Node>
                    <p className="text-center text-xs text-muted-foreground">State engine</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <Node ref={recordingRef} className="relative h-14 w-14">
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background text-[10px] font-semibold text-foreground">
                                3
                            </span>
                            <ClapperboardIcon className="h-6 w-6 text-foreground" />
                        </Node>
                        <p className="text-center text-xs text-muted-foreground">Recording</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Node ref={inferenceRef} className="relative h-14 w-14">
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background text-[10px] font-semibold text-foreground">
                                4
                            </span>
                            <BrainCircuitIcon className="h-6 w-6 text-foreground" />
                        </Node>
                        <p className="text-center text-xs text-muted-foreground">Highlight inference</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <Node ref={montageRef} className="relative h-14 w-14">
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background text-[10px] font-semibold text-foreground">
                            5
                        </span>
                        <FilmIcon className="h-7 w-7 text-foreground" />
                    </Node>
                    <p className="text-center text-xs text-muted-foreground">Montage</p>
                </div>
            </div>

            {/* Start → engine */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={powerOnRef}
                toRef={engineRef}
                duration={6}
                pathColor="hsl(var(--border))"
                pathOpacity={0.35}
                pathWidth={2}
                gradientStartColor="var(--beam-from)"
                gradientStopColor="var(--beam-to)"
            />

            {/* Engine → parallel work */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={engineRef}
                toRef={recordingRef}
                duration={6}
                delay={0.4}
                curvature={40}
                pathColor="hsl(var(--border))"
                pathOpacity={0.35}
                pathWidth={2}
                gradientStartColor="var(--beam-from)"
                gradientStopColor="var(--beam-to)"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={engineRef}
                toRef={inferenceRef}
                duration={6}
                delay={0.4}
                curvature={-40}
                pathColor="hsl(var(--border))"
                pathOpacity={0.35}
                pathWidth={2}
                gradientStartColor="var(--beam-from)"
                gradientStopColor="var(--beam-to)"
            />

            {/* Work loops back to engine */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={recordingRef}
                toRef={engineRef}
                duration={6}
                delay={0.9}
                reverse
                curvature={40}
                pathColor="hsl(var(--border))"
                pathOpacity={0.35}
                pathWidth={2}
                gradientStartColor="var(--beam-from)"
                gradientStopColor="var(--beam-to)"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={inferenceRef}
                toRef={engineRef}
                duration={6}
                delay={0.9}
                reverse
                curvature={-40}
                pathColor="hsl(var(--border))"
                pathOpacity={0.35}
                pathWidth={2}
                gradientStartColor="var(--beam-from)"
                gradientStopColor="var(--beam-to)"
            />

            {/* After the loop: engine → montage */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={engineRef}
                toRef={montageRef}
                duration={6}
                delay={1.4}
                pathColor="hsl(var(--border))"
                pathOpacity={0.35}
                pathWidth={2}
                gradientStartColor="var(--beam-from)"
                gradientStopColor="var(--beam-to)"
            />
        </div>
    );
}
