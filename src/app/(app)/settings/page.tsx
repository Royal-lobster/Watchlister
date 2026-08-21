import { cookies } from "next/headers";
import { SettingsClient } from "@/components/dashboard/settings-client";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("watch_provider_settings")?.value;
  const settings = raw
    ? JSON.parse(raw)
    : { enabled: true, countryCode: "US" };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Settings</h1>
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
