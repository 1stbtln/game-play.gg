"use client";

import { cn } from "@/utils";
import React, { useRef, useState } from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const MagicCard = ({ children, className }: Props) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative max-w-md overflow-hidden rounded-xl border border-border/60 bg-gradient-to-r from-background to-background/40 p-4 md:p-6",
                className
            )}
        >
            {/* Border-only glow: mask keeps radial gradient in a thin ring (not the card interior). */}
            <div
                className="pointer-events-none absolute inset-0 z-0 rounded-xl opacity-0 transition-opacity duration-300 box-border"
                style={{
                    opacity,
                    padding: 2,
                    background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, var(--glow-primary), var(--glow-secondary) 42%, transparent 72%)`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                }}
                aria-hidden
            />
            <div className="relative z-10 min-h-0 w-full">{children}</div>
        </div>
    );
};

export default MagicCard;
