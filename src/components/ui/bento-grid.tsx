import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils";
import { ArrowRightIcon, FilmIcon, KeyboardIcon, SparklesIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export const CARDS = [
    {
        Icon: VideoIcon,
        name: "Live preview & recording",
        description: "System status, controls, and recent activity. Target monitor, one-click capture, timeline, and current snapshot—all in one view.",
        href: "/#features",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: (
            <div className="absolute inset-0">
                <Image
                    src="/controls.png"
                    alt="Operations console with game, target monitor, timeline, and snapshot"
                    fill
                    className="object-cover object-top opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
            </div>
        ),
    },
    {
        Icon: SparklesIcon,
        name: "Auto montages",
        description: "AI-powered highlight reels from your recordings. Get clip-ready moments without scrubbing by hand.",
        href: "/#features",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        background: (
            <div className="absolute inset-0">
                <Image
                    src="/stateTimeline.png"
                    alt="Live timeline confidence graph with state bands"
                    fill
                    className="object-cover object-center opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
            </div>
        ),
    },
    {
        Icon: FilmIcon,
        name: "Raw recordings",
        description: "Full session captures before analysis and montage generation. Browse, play back, open in folder—all local.",
        href: "/#features",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2 max-w-full overflow-hidden",
        background: (
            <div className="absolute inset-0">
                <Image
                    src="/livePreview.png"
                    alt="Live gameplay preview during active match"
                    fill
                    className="object-cover object-center opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
            </div>
        ),
    },
    {
        Icon: KeyboardIcon,
        name: "Settings & keybinds",
        description: "Custom keybinds, target monitor, and game selection. Configure in Settings—start/stop without leaving the game.",
        className: "col-span-3 lg:col-span-1",
        href: "/#features",
        cta: "Learn more",
        background: (
            <div className="absolute inset-0">
                <Image
                    src="/snapshot.png"
                    alt="Current snapshot panel with state confidence and top scores"
                    fill
                    className="object-cover object-top opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            </div>
        ),
    },
];

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
                className,
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: any;
    description: string;
    href: string;
    cta: string;
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-3 flex flex-col justify-between border border-border/60 overflow-hidden rounded-xl",
            "bg-black [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            className,
        )}
    >
        <div>{background}</div>
        <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
            <Icon className="h-12 w-12 origin-left text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
            <h3 className="text-xl font-semibold text-neutral-300">
                {name}
            </h3>
            <p className="max-w-lg text-neutral-400">{description}</p>
        </div>

        <div
            className={cn(
                "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            )}
        >
            <Link href={href} className={buttonVariants({ size: "sm", variant: "ghost", className: "cursor-pointer" })}>
                {cta}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
        </div>
        <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
);

export { BentoCard, BentoGrid };
