import { Metadata } from "next";
import { LOGO_URL } from "@/utils/constants/site";

export const generateMetadata = ({
    title = `${process.env.NEXT_PUBLIC_APP_NAME || "GamePlay"} — Gameplay Recording & Auto Montages for Windows`,
    description = `${process.env.NEXT_PUBLIC_APP_NAME || "GamePlay"} is a Windows desktop app for gameplay recording and montages. Full session captures, generated highlight reels ready for review and export. Lightweight, local storage.`,
    image = "/thumbnail.png",
    icons = [
        {
            rel: "apple-touch-icon",
            sizes: "32x32",
            url: "/apple-touch-icon.png"
        },
        {
            rel: "icon",
            sizes: "32x32",
            url: LOGO_URL
        },
        {
            rel: "icon",
            sizes: "16x16",
            url: LOGO_URL
        },
    ],
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string | null;
    icons?: Metadata["icons"];
    noIndex?: boolean;
} = {}): Metadata => ({
    title,
    description,
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
        title,
        description,
        ...(image && { images: [{ url: image }] }),
    },
    twitter: {
        title,
        description,
        ...(image && { card: "summary_large_image", images: [image] }),
        creator: "@gameplay_gg",
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
});
