import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Accept, Content-Type, X-Gameplay-Client",
    "Access-Control-Max-Age": "86400",
};

const MAX_SUBJECT_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 320;
const VALID_CATEGORIES = ["bug", "recording", "engine", "performance", "account", "billing", "feature", "other"] as const;
const VALID_PRIORITIES = ["low", "normal", "high"] as const;

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body." },
            { status: 400, headers: CORS_HEADERS },
        );
    }

    const { email, subject, description, message, priority, category, systemInfo, userId } = body as Record<
        string,
        unknown
    >;

    if (!email || typeof email !== "string" || !email.includes("@") || email.length > MAX_EMAIL_LENGTH) {
        return NextResponse.json(
            { error: "A valid email is required." },
            { status: 422, headers: CORS_HEADERS },
        );
    }

    const subjectStr =
        typeof subject === "string" && subject.trim().length > 0
            ? subject.trim()
            : null;
    const descriptionStr =
        typeof description === "string" && description.trim().length > 0
            ? description.trim()
            : typeof message === "string" && message.trim().length > 0
              ? message.trim()
              : null;

    if (!subjectStr) {
        return NextResponse.json({ error: "Subject is required." }, { status: 422, headers: CORS_HEADERS });
    }
    if (subjectStr.length > MAX_SUBJECT_LENGTH) {
        return NextResponse.json(
            { error: `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters.` },
            { status: 422, headers: CORS_HEADERS },
        );
    }
    if (!descriptionStr) {
        return NextResponse.json({ error: "Description is required." }, { status: 422, headers: CORS_HEADERS });
    }
    if (descriptionStr.length > MAX_DESCRIPTION_LENGTH) {
        return NextResponse.json(
            { error: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.` },
            { status: 422, headers: CORS_HEADERS },
        );
    }

    const cat = typeof category === "string" && VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])
        ? category
        : "other";

    const pri =
        typeof priority === "string" && VALID_PRIORITIES.includes(priority as typeof VALID_PRIORITIES[number])
            ? priority
            : "normal";

    const supabase = createAdminClient();

    const { error } = await supabase.from("support_tickets").insert({
        email: email.trim().toLowerCase(),
        subject: subjectStr,
        message: descriptionStr,
        priority: pri,
        category: cat,
        system_info: typeof systemInfo === "object" && systemInfo !== null ? systemInfo : null,
        user_id: typeof userId === "string" && userId.length > 0 ? userId : null,
        source: request.headers.get("x-gameplay-client") === "desktop" ? "desktop" : "web",
    });

    if (error) {
        console.error("[support] insert error:", error);
        return NextResponse.json(
            { error: "Failed to submit support request. Please try again." },
            { status: 500, headers: CORS_HEADERS },
        );
    }

    return NextResponse.json(
        { success: true, message: "Support request received. We'll get back to you soon." },
        { status: 201, headers: CORS_HEADERS },
    );
}
