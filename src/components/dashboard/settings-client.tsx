"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toggleWatchProviderAction } from "@/actions/settings";
import { Loader2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      {/* Card header */}
      <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-border">
        <Video className="size-4 text-primary flex-shrink-0" aria-hidden="true" />
        <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
          Watch Providers
        </span>
      </CardHeader>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <CardContent className="px-5 py-0">
          {/* Toggle row */}
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-col gap-0.5">
              <Label className="text-sm font-medium text-foreground">
                Show Watch Providers
              </Label>
              <span className="text-xs text-muted-foreground">
                Display streaming availability on titles
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              disabled={isPending}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                enabled ? "bg-primary" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "inline-block size-4 rounded-full bg-background shadow-sm transition-transform",
                  enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {/* Country row */}
          <div className="flex items-center justify-between gap-4 py-4 border-t border-border pb-5">
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor="country-select"
                className="text-sm font-medium text-foreground"
              >
                Country / Region
              </Label>
              <span className="text-xs text-muted-foreground">
                Show providers available in your region
              </span>
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

        {/* Footer */}
        <CardFooter className="flex flex-col gap-3 items-stretch border-t border-border bg-muted/40 px-5 py-4">
          {/* Feedback messages */}
          {successMessage && (
            <p
              className="text-sm text-green-500"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p
              className="text-sm text-destructive"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </p>
          )}

          {/* Save button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} aria-busy={isPending}>
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              {isPending ? "Saving…" : "Save Settings"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
