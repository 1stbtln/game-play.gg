import { BarChart3Icon, FolderOpenIcon, SparklesIcon, VideoIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
    { name: "Streamers", logo: "/assets/company-01.svg" },
    { name: "Content Creators", logo: "/assets/company-02.svg" },
    { name: "Esports", logo: "/assets/company-03.svg" },
    { name: "Coaches", logo: "/assets/company-04.svg" },
    { name: "Casual Players", logo: "/assets/company-05.svg" },
    { name: "Clips & Highlights", logo: "/assets/company-06.svg" },
] as const;

export const PROCESS = [
    {
        title: "Record Your Gameplay",
        description: "Live preview, target monitor, and one-click capture. Full session recordings with configurable resolution, FPS, and optional audio. System status and controls in one place.",
        icon: VideoIcon,
    },
    {
        title: "Raw Recordings",
        description: "Full session captures before analysis and montage generation. Browse, play back, and open in folder. All recordings stay local—no cloud lock-in.",
        icon: FolderOpenIcon,
    },
    {
        title: "Montages",
        description: "Generated highlight reels ready for review and export. Run montage from any raw recording. Get clip-ready moments without scrubbing by hand.",
        icon: SparklesIcon,
    },
] as const;

export const FEATURES = [
    { title: "Live preview & recording", description: "System status, controls, target monitor. One-click capture." },
    { title: "Raw recordings", description: "Full session captures before analysis and montage generation." },
    { title: "Montages", description: "Generated highlight reels ready for review and export." },
    { title: "State log", description: "Live state and confidence stream. See what the engine sees." },
    { title: "Settings & keybinds", description: "Target monitor, game selection, Music Search for montage audio." },
    { title: "Windows-native", description: "Lightweight, local storage. No cloud required." },
] as const;

export const REVIEWS = [
    { name: "Alex Chen", username: "@alexclips", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Alex", rating: 5, review: "Finally an app that just records and makes clips without the bloat. Montages save me hours every week." },
    { name: "Jordan Blake", username: "@jordanstreams", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Jordan", rating: 5, review: "Clean UI, reliable recording, and the auto montage feature is legit. My highlight reels have never been easier." },
    { name: "Sam Rivera", username: "@samplays", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Sam", rating: 4, review: "Simple and fast. Exactly what I needed for capturing ranked sessions and sharing best moments." },
    { name: "Casey Morgan", username: "@caseygaming", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Casey", rating: 5, review: "GamePlay replaced three separate tools for me. One app for record, store, and clip. Recommended." },
    { name: "Riley Kim", username: "@rileyk", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Riley", rating: 4, review: "Keybinds and settings are straightforward. Recording is stable and the montage pipeline works well." },
    { name: "Taylor Brooks", username: "@taylorb", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Taylor", rating: 5, review: "As a small creator, having local recordings plus auto highlights is a game-changer. No subscription fatigue." },
    { name: "Morgan Lee", username: "@morganlee", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Morgan", rating: 4, review: "Lightweight and does what it says. Montages are a nice touch for quick social clips." },
    { name: "Jamie Park", username: "@jamiep", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Jamie", rating: 5, review: "Best gameplay recorder I've used on Windows. Simple, fast, and the highlight feature actually works." },
    { name: "Quinn Davis", username: "@quinnd", avatar: "https://api.dicebear.com/8.x/initials/svg?seed=Quinn", rating: 5, review: "Record, clip, share — all in one place. GamePlay is now part of my daily workflow." },
] as const;
