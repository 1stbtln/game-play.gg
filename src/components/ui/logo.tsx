import { APP_NAME, LOGO_URL } from "@/utils/constants/site";
import { cn } from "@/utils";
import Image from "next/image";
import React from "react";

interface Props {
    variant?: "icon" | "text" | "full";
    className?: string;
}

const Logo = ({ variant = "icon", className }: Props) => {
    const alt = `${APP_NAME} logo`;

    if (variant === "icon") {
        return (
            <Image
                src={LOGO_URL}
                alt={alt}
                width={64}
                height={64}
                className={cn("h-8 w-8 object-contain", className)}
                priority={false}
            />
        );
    }

    if (variant === "text") {
        return (
            <Image
                src={LOGO_URL}
                alt={alt}
                width={240}
                height={64}
                className={cn("h-5 w-auto max-w-[200px] object-contain object-left", className)}
                priority={false}
            />
        );
    }

    return (
        <div className={cn("flex items-center", className)}>
            <Image
                src={LOGO_URL}
                alt={alt}
                width={280}
                height={72}
                className="h-8 w-auto max-w-[220px] object-contain object-left"
                priority={false}
            />
        </div>
    );
};

export default Logo;
