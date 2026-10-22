import { CheckIcon, MinusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatMemory,
  formatNotesHours,
  formatUsd,
  getPlans,
  type Plan,
} from "@/lib/copper/catalog";

// How much paying yearly saves over twelve monthly payments, to the cent.
function annualSavings(plan: Plan): number {
  return Math.round((plan.monthlyUsd * 12 - plan.annualUsd) * 100) / 100;
}

export function PlusPricing() {
  const plans = getPlans();

  return (
    <section id="plus" data-testid="plus-pricing">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Copper Plus
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Refine your answers.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {plans.map((plan) => {
            const plus = plan.id === "copper-plus";
            const savings = annualSavings(plan);
            return (
              <Card
                key={plan.id}
                data-testid="plan-card"
                data-plan={plan.id}
                className={cn("gap-6", plus && "ring-primary ring-2")}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
                      {plan.name}
                    </CardTitle>
                    {plus && <Badge>Refine your answers</Badge>}
                  </div>
                  {plan.monthlyUsd === 0 && plan.annualUsd === 0 ? (
                    <div>
                      <p className="font-heading text-4xl font-semibold tracking-tight">
                        {formatUsd(0)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-base">
                        Included with every device
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-heading text-4xl font-semibold tracking-tight">
                        <span className={cn(plus && "text-primary")}>
                          {formatUsd(plan.monthlyUsd)}
                        </span>
                        <span className="text-muted-foreground text-lg font-normal">
                          /month
                        </span>
                      </p>
                      <p className="text-muted-foreground mt-1 text-base">
                        or {formatUsd(plan.annualUsd)}/year
                        {savings > 0 &&
                          ` (save ${formatUsd(savings)} a year with annual billing)`}
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <dl className="divide-border divide-y text-base">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">Memory kept</dt>
                      <dd className="font-semibold">
                        {formatMemory(plan.memoryDays)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">Notes recording</dt>
                      <dd className="font-semibold">
                        {formatNotesHours(plan.notesHoursPerMonth)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">Refined answers</dt>
                      <dd className="flex items-center gap-1.5 font-semibold">
                        {plan.refinedAnswers ? (
                          <>
                            <CheckIcon aria-hidden className="text-primary" />
                            Included
                          </>
                        ) : (
                          <>
                            <MinusIcon
                              aria-hidden
                              className="text-muted-foreground"
                            />
                            Not included
                          </>
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
