"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, PLANS } from "@/utils";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Tab = "monthly" | "yearly";
type StripePricesResponse = {
    pro?: {
        monthly?: { unit_amount: number | null; currency: string };
        yearly?: { unit_amount: number | null; currency: string };
    };
};

const PricingCards = () => {

    const MotionTabTrigger = motion(TabsTrigger);

    const [activeTab, setActiveTab] = useState<Tab>("monthly");
    const [stripePrices, setStripePrices] = useState<StripePricesResponse | null>(null);

    const planCtaHref = (planName: string) => {
        const interval = activeTab === "monthly" ? "monthly" : "yearly";
        if (planName === "Free") return "/auth/sign-up";
        if (planName === "Pro") return `/api/stripe/checkout?plan=pro&interval=${interval}`;
        return "/pricing";
    };

    useEffect(() => {
        let mounted = true;
        fetch("/api/stripe/prices")
            .then(async (res) => {
                if (!res.ok) return null;
                return (await res.json()) as StripePricesResponse;
            })
            .then((data) => {
                if (mounted && data) setStripePrices(data);
            })
            .catch(() => {
                // Fallback to local defaults in PLANS if API is unavailable.
            });
        return () => {
            mounted = false;
        };
    }, []);

    const proMonthly = useMemo(() => {
        const cents = stripePrices?.pro?.monthly?.unit_amount;
        return typeof cents === "number" ? cents / 100 : null;
    }, [stripePrices]);

    const proYearly = useMemo(() => {
        const cents = stripePrices?.pro?.yearly?.unit_amount;
        return typeof cents === "number" ? cents / 100 : null;
    }, [stripePrices]);

    const getMonthlyPrice = (planName: string, fallback: number) => {
        if (planName !== "Pro") return fallback;
        return proMonthly ?? fallback;
    };

    const getYearlyPrice = (planName: string, fallback: number) => {
        if (planName !== "Pro") return fallback;
        return proYearly ?? fallback;
    };

    const getDiscountPct = (planName: string, fallbackMonthly: number, fallbackYearly: number) => {
        if (planName !== "Pro") return 0;
        const monthly = getMonthlyPrice(planName, fallbackMonthly);
        const yearly = getYearlyPrice(planName, fallbackYearly);
        if (!monthly || !yearly) return 0;
        const fullYear = monthly * 12;
        if (fullYear <= 0 || yearly >= fullYear) return 0;
        return Math.round(((fullYear - yearly) / fullYear) * 100);
    };

    const formatPrice = (value: number) => {
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    };

    return (
        <Tabs defaultValue="monthly" className="w-full flex flex-col items-center justify-center">
            <TabsList>
                <MotionTabTrigger
                    value="monthly"
                    onClick={() => setActiveTab("monthly")}
                    className="relative"
                >
                    {activeTab === "monthly" && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            transition={{
                                type: "spring",
                                bounce: 0.5,
                            }}
                            className="absolute top-0 left-0 w-full h-full bg-background shadow-sm rounded-md z-10"
                        />
                    )}
                    <span className="z-20">
                        Monthly
                    </span>
                </MotionTabTrigger>
                <MotionTabTrigger
                    value="yearly"
                    onClick={() => setActiveTab("yearly")}
                    className="relative"
                >
                    {activeTab === "yearly" && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            transition={{
                                type: "spring",
                                bounce: 0.5,
                            }}
                            className="absolute top-0 left-0 w-full h-full bg-background shadow-sm rounded-md z-10"
                        />
                    )}
                    <span className="z-20">
                        Yearly
                    </span>
                </MotionTabTrigger>
            </TabsList>

            <TabsContent value="monthly" className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full md:gap-8 flex-wrap max-w-4xl mx-auto pt-6">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "flex flex-col w-full max-w-[26rem] justify-self-center border-border rounded-2xl overflow-hidden",
                            plan.name === "Pro" && "border border-[rgba(96,165,250,0.25)]"
                        )}
                    >
                        <CardHeader className={cn(
                            "border-b border-border rounded-t-2xl",
                            plan.name === "Pro" ? "bg-[rgba(96,165,250,0.12)]" : "bg-foreground/[0.03]"
                        )}>
                            <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                                {plan.name}
                            </CardTitle>
                            <CardDescription>
                                {plan.info}
                            </CardDescription>
                            <h5 className="text-3xl font-semibold">
                                ${formatPrice(getMonthlyPrice(plan.name, plan.price.monthly))}
                                <span className="text-base text-muted-foreground font-normal">
                                    {plan.name !== "Free" ? "/month" : ""}
                                </span>
                            </h5>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="text-[rgba(96,165,250,0.9)] w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <p className={cn(feature.tooltip && "border-b !border-dashed border-border cursor-pointer")}>
                                                    {feature.text}
                                                </p>
                                            </TooltipTrigger>
                                            {feature.tooltip && (
                                                <TooltipContent>
                                                    <p>{feature.tooltip}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="w-full mt-auto pt-6">
                            <Link
                                href={planCtaHref(plan.name)}
                                className={cn(
                                    "w-full rounded-xl py-2.5 text-center text-sm font-medium transition-colors",
                                    plan.name === "Pro"
                                        ? "border border-[rgba(96,165,250,0.4)] bg-transparent text-sky-300 hover:bg-[rgba(96,165,250,0.12)]"
                                        : "border border-border bg-transparent text-foreground hover:bg-foreground/[0.05]"
                                )}
                            >
                                {plan.btn.text}
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </TabsContent>
            <TabsContent value="yearly" className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full md:gap-8 flex-wrap max-w-4xl mx-auto pt-6">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "flex flex-col w-full max-w-[26rem] justify-self-center border-border rounded-2xl overflow-hidden",
                            plan.name === "Pro" && "border border-[rgba(96,165,250,0.25)]"
                        )}
                    >
                        <CardHeader className={cn(
                            "border-b border-border rounded-t-2xl",
                            plan.name === "Pro" ? "bg-[rgba(96,165,250,0.12)]" : "bg-foreground/[0.03]"
                        )}>
                            <CardTitle className={cn(plan.name !== "Pro" && "text-muted-foreground", "text-lg font-medium")}>
                                {plan.name}
                            </CardTitle>
                            <CardDescription>
                                {plan.info}
                            </CardDescription>
                            <h5 className="text-3xl font-semibold flex items-end">
                                ${formatPrice(getYearlyPrice(plan.name, plan.price.yearly))}
                                <div className="text-base text-muted-foreground font-normal">
                                    {plan.name !== "Free" ? "/year" : ""}
                                </div>
                                {plan.name !== "Free" && getDiscountPct(plan.name, plan.price.monthly, plan.price.yearly) > 0 && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                                        className="px-2 py-0.5 ml-2 rounded-md bg-[rgba(96,165,250,0.18)] text-sky-300 border border-[rgba(96,165,250,0.5)] text-sm font-medium"
                                    >
                                        -{getDiscountPct(plan.name, plan.price.monthly, plan.price.yearly)}%
                                    </motion.span>
                                )}
                            </h5>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircleIcon className="text-[rgba(96,165,250,0.9)] w-4 h-4" />
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <p className={cn(feature.tooltip && "border-b !border-dashed border-border cursor-pointer")}>
                                                    {feature.text}
                                                </p>
                                            </TooltipTrigger>
                                            {feature.tooltip && (
                                                <TooltipContent>
                                                    <p>{feature.tooltip}</p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="w-full pt-6 mt-auto">
                            <Link
                                href={planCtaHref(plan.name)}
                                className={cn(
                                    "w-full rounded-xl py-2.5 text-center text-sm font-medium transition-colors",
                                    plan.name === "Pro"
                                        ? "border border-[rgba(96,165,250,0.4)] bg-transparent text-sky-300 hover:bg-[rgba(96,165,250,0.12)]"
                                        : "border border-border bg-transparent text-foreground hover:bg-foreground/[0.05]"
                                )}
                            >
                                {plan.btn.text}
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </TabsContent>
        </Tabs>
    )
};

export default PricingCards
