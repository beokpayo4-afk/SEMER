import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { getSettings, type StoreSettings } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";

export function SettingsPage() {
  usePageTitle("Admin settings");
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getSettings()
      .then((next) => {
        if (active) {
          setSettings(next);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Settings could not be loaded."));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Settings</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        These are the store values the server is willing to show. Database credentials and payment secrets stay in the server environment.
      </p>
      {error ? <ErrorMessage message={error} /> : null}
      {!settings && !error ? <Loading label="Loading settings" /> : null}
      {settings ? (
        <dl className="mt-6 max-w-xl divide-y divide-line rounded-3xl border border-line bg-white">
          {[
            ["Store", settings.store_name],
            ["Currency", settings.currency],
            ["Payment provider", settings.payment_provider],
            ["Low stock threshold", String(settings.low_stock_threshold)],
            ["Environment", settings.environment],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[180px_1fr]">
              <dt className="text-muted">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
