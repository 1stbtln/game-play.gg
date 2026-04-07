import {
    ActivityIcon,
    BookOpenIcon,
    CircleHelpIcon,
    FilmIcon,
    KeyboardIcon,
    NewspaperIcon,
    SparklesIcon,
    VideoIcon,
} from "lucide-react";

export const NAV_LINKS = [
    {
        title: "Features",
        href: "/#features",
        menu: [
            {
                title: "Live Preview & Recording",
                tagline: "System status, controls, and recent activity.",
                href: "/#features",
                icon: VideoIcon,
            },
            {
                title: "Montages",
                tagline: "Generated highlight reels ready for review and export.",
                href: "/#features",
                icon: SparklesIcon,
            },
            {
                title: "Raw Recordings",
                tagline: "Full session captures before analysis and montage generation.",
                href: "/#features",
                icon: FilmIcon,
            },
            {
                title: "State Log",
                tagline: "Live state and confidence stream. See what the engine sees.",
                href: "/#features",
                icon: ActivityIcon,
            },
            {
                title: "Settings & Keybinds",
                tagline: "Target monitor, game selection, Music Search for montage audio.",
                href: "/#features",
                icon: KeyboardIcon,
            },
        ],
    },
    {
        title: "Pricing",
        href: "/#pricing",
    },
    {
        title: "Resources",
        href: "/resources",
        menu: [
            {
                title: "Documentation",
                tagline: "Guides and reference for GamePlay.",
                href: "/resources/documentation",
                icon: BookOpenIcon,
            },
            {
                title: "Support",
                tagline: "Get help and answers.",
                href: "/resources/help",
                icon: CircleHelpIcon,
            },
            {
                title: "Blog",
                tagline: "Tips for streamers and content creators.",
                href: "/resources/blog",
                icon: NewspaperIcon,
            },
        ],
    },
    {
        title: "Changelog",
        href: "/changelog",
    },
];
