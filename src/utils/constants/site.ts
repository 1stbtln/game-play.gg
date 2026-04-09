export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "GamePlay";

/** Primary logo asset in `public/logo.png`. */
export const LOGO_URL = "/logo.png";

export const APP_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
    process.env.NEXT_PUBLIC_APP_DOMAIN,
    `www.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
]);
