"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatNotesHours,
  formatUsd,
  type Plan,
  type Product,
} from "@/lib/copper/catalog";

type Place = "home" | "work" | "both";
type Need = "home" | "notes" | "both";
type Hours = "within-free" | "over-free" | "none";
export type QuizAnswers = { place: Place; need: Need; hours: Hours };

export type Recommendation = {
  products: Product[];
  /** Suggested when Notes is recommended and the free recording limit is too small. */
  plus?: Plan;
};

// Products follow what would help most (or both, when the answer is "both"),
// and Copper Plus is suggested only for Notes users over the free hours.
export function recommend(
  answers: QuizAnswers,
  products: Product[],
  plans: Plan[],
): Recommendation {
  const ids =
    answers.place === "both" || answers.need === "both"
      ? ["copper-home", "copper-notes"]
      : answers.need === "home"
        ? ["copper-home"]
        : ["copper-notes"];
  const picked = products.filter((p) => ids.includes(p.id));
  const plus = plans.find((p) => p.id === "copper-plus");
  const wantsPlus =
    answers.hours === "over-free" && ids.includes("copper-notes");
  return { products: picked, plus: wantsPlus ? plus : undefined };
}

type Question<K extends keyof QuizAnswers> = {
  key: K;
  title: string;
  options: { value: QuizAnswers[K]; label: string }[];
};

function questions(freeHours: string) {
  return [
    {
      key: "place",
      title: "Where do you want help?",
      options: [
        { value: "home", label: "At home" },
        { value: "work", label: "In meetings or classes" },
        { value: "both", label: "Both" },
      ],
    } satisfies Question<"place">,
    {
      key: "need",
      title: "What would help most?",
      options: [
        {
          value: "home",
          label: "Running my lights, sprinklers and thermostat",
        },
        { value: "notes", label: "Notes and summaries of what's said" },
        { value: "both", label: "A bit of both" },
      ],
    } satisfies Question<"need">,
    {
      key: "hours",
      title:
        "About how many hours of meetings or lectures do you have a month?",
      options: [
        { value: "within-free", label: `Up to ${freeHours} hours` },
        { value: "over-free", label: `More than ${freeHours} hours` },
        { value: "none", label: "None" },
      ],
    } satisfies Question<"hours">,
  ];
}

export function ProductQuiz({
  products,
  plans,
}: {
  products: Product[];
  plans: Plan[];
}) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [step, setStep] = useState(0);
  // Set when "See details" closes the quiz, so focus doesn't jump back to the hero.
  const jumping = useRef(false);

  const free = plans.find((p) => p.id === "free");
  const steps = questions(free?.notesHoursPerMonth ?? "10");
  const done = step >= steps.length;
  const result = done
    ? recommend(answers as QuizAnswers, products, plans)
    : undefined;

  function reset() {
    setAnswers({});
    setStep(0);
  }

  function seeDetails(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    jumping.current = true;
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Reset on open, so the result doesn't flash back to question 1 while closing.
        if (next) reset();
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="h-11 px-6 text-base">
          Find my Copper
        </Button>
      </DialogTrigger>
      <DialogContent
        className="gap-6 p-6 sm:max-w-md"
        onCloseAutoFocus={(event) => {
          if (!jumping.current) return;
          jumping.current = false;
          event.preventDefault();
          document.getElementById("products")?.scrollIntoView();
        }}
      >
        {!done ? (
          <>
            <DialogHeader className="gap-2">
              <p className="text-muted-foreground text-sm">
                Question {step + 1} of {steps.length}
              </p>
              <DialogTitle className="text-xl leading-snug font-bold">
                {steps[step].title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Pick the answer that fits you best.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              {steps[step].options.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="h-auto justify-start px-4 py-3 text-left text-base whitespace-normal"
                  onClick={() => {
                    setAnswers({ ...answers, [steps[step].key]: option.value });
                    setStep(step + 1);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            {step > 0 && (
              <Button
                variant="ghost"
                className="justify-self-start"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
          </>
        ) : (
          <>
            <DialogHeader className="gap-2">
              <p className="text-muted-foreground text-sm">Your match</p>
              <DialogTitle className="text-xl leading-snug font-bold">
                {result!.products.map((p) => p.name).join(" and ")}
              </DialogTitle>
              <DialogDescription>
                Based on where you want help and what would help most.
              </DialogDescription>
            </DialogHeader>
            <ul className="flex flex-col gap-4">
              {result!.products.map((product) => (
                <li
                  key={product.id}
                  data-testid="quiz-match"
                  data-product={product.id}
                  className="bg-secondary rounded-lg p-4"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-primary font-bold">
                      {formatUsd(product.priceUsd)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {product.type}:{" "}
                    {product.features.map((f) => f.name).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
            {result!.plus && free && (
              <p data-testid="quiz-plus" className="text-base">
                You record more than the free plan covers (
                {formatNotesHours(free.notesHoursPerMonth)}).{" "}
                {result!.plus.name} gives you{" "}
                {formatNotesHours(
                  result!.plus.notesHoursPerMonth,
                ).toLowerCase()}{" "}
                recording for {formatUsd(result!.plus.monthlyUsd)}/month.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="#products" onClick={seeDetails}>
                  See details
                </a>
              </Button>
              <Button variant="ghost" onClick={reset}>
                Start over
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
