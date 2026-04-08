import { redirect } from "next/navigation";

export default async function DashboardPage() {
    redirect("/api/stripe/portal");
}
