import { ShieldCheckIcon } from "lucide-react";
import { getPrivacySummary } from "@/lib/copper/catalog";

export function PrivacySummary() {
  const privacy = getPrivacySummary();

  return (
    <section
      id="privacy"
      data-testid="privacy-summary"
      className="bg-accent/10"
    >
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Your privacy, in plain words
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          How Copper handles your recordings under our {privacy.policy} privacy
          policy.
        </p>
        <ul className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {privacy.points.map((point) => (
            <li key={point} className="flex gap-3 text-base leading-relaxed">
              <ShieldCheckIcon
                aria-hidden
                className="text-accent mt-0.5 size-5 shrink-0"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
