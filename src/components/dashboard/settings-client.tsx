"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toggleWatchProviderAction } from "@/actions/settings";

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

function Spinner() {
  return (
    <svg
      className="animate-spin size-4 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

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
    <div className="settings-root">
      {/* Scoped styles */}
      <style>{`
        /* Toggle switch */
        .settings-root .toggle-track {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 44px;
          height: 24px;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          background-color: var(--color-surface-raised);
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
          flex-shrink: 0;
        }
        .settings-root .toggle-track--on {
          background-color: var(--color-accent);
          border-color: var(--color-accent);
        }
        .settings-root .toggle-track:focus-within {
          outline: none;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 30%, transparent);
        }
        .settings-root .toggle-thumb {
          position: absolute;
          left: 3px;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background-color: var(--color-text-muted);
          transition: transform 0.2s ease, background-color 0.2s ease;
          pointer-events: none;
        }
        .settings-root .toggle-track--on .toggle-thumb {
          transform: translateX(20px);
          background-color: #ffffff;
        }
        .settings-root .toggle-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          margin: 0;
        }

        /* Country select */
        .settings-root .country-select {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          padding: 0.625rem 2.5rem 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background-color: var(--color-surface-raised);
          color: var(--color-text-primary);
          font-size: 0.875rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: border-color 0.18s ease, background-color 0.18s ease;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23606060' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.625rem center;
          background-size: 1rem;
        }
        .settings-root .country-select:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 25%, transparent);
        }
        .settings-root .country-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .settings-root .country-select option {
          background-color: var(--color-surface-raised);
          color: var(--color-text-primary);
        }

        /* Save button */
        .settings-root .save-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem 1.5rem;
          border-radius: var(--radius-md);
          background-color: var(--color-accent);
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: var(--font-sans);
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          transition: background-color 0.18s ease, opacity 0.18s ease, transform 0.12s ease;
        }
        .settings-root .save-btn:hover:not(:disabled) {
          background-color: var(--color-accent-hover);
        }
        .settings-root .save-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .settings-root .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .settings-root .save-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 40%, transparent);
        }

        /* Feedback messages */
        .settings-root .msg-success {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          border: 1px solid color-mix(in srgb, #16a34a 40%, transparent);
          background-color: color-mix(in srgb, #16a34a 8%, transparent);
          color: #4ade80;
          font-size: 0.8125rem;
          font-weight: 500;
        }
        .settings-root .msg-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          border: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
          background-color: var(--color-accent-subtle);
          color: color-mix(in srgb, var(--color-accent) 80%, #ffffff);
          font-size: 0.8125rem;
          font-weight: 500;
        }

        /* Field row */
        .settings-root .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 0;
        }
        .settings-root .field-row + .field-row {
          border-top: 1px solid var(--color-border-subtle);
        }
        .settings-root .field-label {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        .settings-root .field-label-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .settings-root .field-label-hint {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }
        .settings-root .field-control {
          flex-shrink: 0;
        }
        .settings-root .select-wrapper {
          position: relative;
          min-width: 180px;
        }
      `}</style>

      {/* Card */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Card header accent hairline */}
        <div
          aria-hidden="true"
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 20%, transparent) 100%)",
          }}
        />

        {/* Card header */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--color-border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
              width: "1rem",
              height: "1rem",
              color: "var(--color-accent)",
              flexShrink: 0,
            }}
          >
            <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
            }}
          >
            Watch Providers
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "0 1.25rem" }}>
            {/* Toggle row */}
            <div className="field-row">
              <div className="field-label">
                <span className="field-label-text">Show Watch Providers</span>
                <span className="field-label-hint">
                  Display streaming availability on titles
                </span>
              </div>
              <div className="field-control">
                <label
                  className={`toggle-track${enabled ? " toggle-track--on" : ""}`}
                  aria-label="Show Watch Providers"
                >
                  <input
                    type="checkbox"
                    className="toggle-input"
                    checked={enabled}
                    disabled={isPending}
                    onChange={(e) => setEnabled(e.target.checked)}
                    aria-checked={enabled}
                  />
                  <span className="toggle-thumb" aria-hidden="true" />
                </label>
              </div>
            </div>

            {/* Country row */}
            <div className="field-row" style={{ paddingBottom: "1.25rem" }}>
              <div className="field-label">
                <span className="field-label-text">Country / Region</span>
                <span className="field-label-hint">
                  Show providers available in your region
                </span>
              </div>
              <div className="field-control select-wrapper">
                <select
                  className="country-select"
                  value={countryCode}
                  disabled={isPending || !enabled}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Select country"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "0.875rem 1.25rem",
              borderTop: "1px solid var(--color-border-subtle)",
              backgroundColor: "var(--color-surface-raised)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {/* Feedback messages */}
            {successMessage && (
              <div className="msg-success" role="status" aria-live="polite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ width: "1rem", height: "1rem", flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="msg-error" role="alert" aria-live="assertive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ width: "1rem", height: "1rem", flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMessage}
              </div>
            )}

            {/* Save button row */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="save-btn"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending && <Spinner />}
                {isPending ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
