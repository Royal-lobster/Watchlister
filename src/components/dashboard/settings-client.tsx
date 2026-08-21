"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toggleWatchProviderAction } from "@/actions/settings";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SettingsClientProps {
  initialSettings: { enabled: boolean; countryCode: string };
}

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "JP", label: "Japan" },
  { code: "IN", label: "India" },
  { code: "BR", label: "Brazil" },
  { code: "MX", label: "Mexico" },
];

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [countryCode, setCountryCode] = useState(initialSettings.countryCode);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { execute, isPending } = useAction(toggleWatchProviderAction, {
    onSuccess: () => {
      setSuccessMessage("Settings saved!");
      setErrorMessage(null);
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    },
    onError: () => {
      setErrorMessage("Failed to save settings. Please try again.");
      setSuccessMessage(null);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    execute({ enabled, countryCode });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Watch Providers</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-providers" className="text-sm font-medium">
                Show Watch Providers
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Display streaming availability on titles
              </p>
            </div>
            <Switch
              id="show-providers"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={isPending}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="country-select" className="text-sm font-medium">
                Country / Region
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Show providers available in your region
              </p>
            </div>
            <select
              id="country-select"
              value={countryCode}
              disabled={isPending || !enabled}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Select country"
              className="w-44 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 items-stretch border-t pt-4">
          {successMessage && (
            <p className="text-sm text-green-600" role="status" aria-live="polite">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive" role="alert" aria-live="assertive">
              {errorMessage}
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isPending ? "Saving…" : "Save Settings"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
