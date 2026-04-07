export const PLANS = [
    {
        name: "Free",
        info: "For casual players",
        price: { monthly: 0, yearly: 0 },
        features: [
            { text: "Unlimited gameplay recording" },
            { text: "Raw recordings saved locally" },
            { text: "Custom keybinds" },
            { text: "Basic settings", tooltip: "Resolution, FPS, quality" },
            { text: "Community support", tooltip: "Discord and documentation" },
        ],
        btn: { text: "Download for Windows", href: "/dashboard", variant: "default" },
    },
    {
        name: "Pro",
        info: "For streamers & creators",
        price: { monthly: 9, yearly: Math.round(9 * 12 * (1 - 0.12)) },
        features: [
            { text: "Everything in Free" },
            { text: "Auto montages", tooltip: "AI-powered highlight reels" },
            { text: "Music search & montage audio" },
            { text: "Priority support", tooltip: "Faster help when you need it" },
            { text: "Early access to new features" },
        ],
        btn: { text: "Get Pro", href: "/dashboard", variant: "purple" },
    },
    {
        name: "Team",
        info: "For orgs & studios",
        price: { monthly: 49, yearly: Math.round(49 * 12 * (1 - 0.12)) },
        features: [
            { text: "Everything in Pro" },
            { text: "Unlimited montages" },
            { text: "Dedicated support", tooltip: "Direct line to our team" },
            { text: "Custom keybinds & presets" },
            { text: "Volume licensing", tooltip: "Deploy across your team" },
        ],
        btn: { text: "Contact us", href: "/dashboard", variant: "default" },
    },
];

export const PRICING_FEATURES = [
    { text: "Gameplay recording", tooltip: "Full-session capture in high quality." },
    { text: "Raw recordings", tooltip: "Local MP4 files you own." },
    { text: "Auto montages", tooltip: "AI-generated highlight clips." },
    { text: "Custom keybinds", tooltip: "Start/stop your way." },
    { text: "Community support", tooltip: "Discord and docs." },
    { text: "Priority support", tooltip: "Pro and Team plans." },
];

export const WORKSPACE_LIMIT = 2;
