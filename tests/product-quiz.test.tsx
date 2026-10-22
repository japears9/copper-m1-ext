import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ProductQuiz,
  recommend,
  type QuizAnswers,
} from "@/components/copper/product-quiz";
import { formatUsd, getPlans, getProducts } from "@/lib/copper/catalog";

const ids = (answers: QuizAnswers) =>
  recommend(answers, getProducts(), getPlans()).products.map((p) => p.id);

describe("recommend", () => {
  it("follows what would help most", () => {
    expect(ids({ place: "home", need: "home", hours: "none" })).toEqual([
      "copper-home",
    ]);
    expect(ids({ place: "work", need: "notes", hours: "within-free" })).toEqual(
      ["copper-notes"],
    );
  });

  it("recommends both when either answer is both", () => {
    const both = ["copper-home", "copper-notes"];
    expect(ids({ place: "both", need: "home", hours: "none" })).toEqual(both);
    expect(ids({ place: "work", need: "both", hours: "none" })).toEqual(both);
  });

  it("suggests Copper Plus only for Notes users over the free hours", () => {
    const plus = (answers: QuizAnswers) =>
      recommend(answers, getProducts(), getPlans()).plus?.id;
    expect(plus({ place: "work", need: "notes", hours: "over-free" })).toBe(
      "copper-plus",
    );
    expect(
      plus({ place: "work", need: "notes", hours: "within-free" }),
    ).toBeUndefined();
    expect(
      plus({ place: "home", need: "home", hours: "over-free" }),
    ).toBeUndefined();
  });
});

describe("ProductQuiz", () => {
  function answer(...labels: (string | RegExp)[]) {
    for (const label of labels) {
      fireEvent.click(screen.getByRole("button", { name: label }));
    }
  }

  it("opens from the button and walks through three questions to a match", () => {
    render(<ProductQuiz products={getProducts()} plans={getPlans()} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Which product is right for me?" }),
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("Question 1 of 3");
    answer("In meetings or classes", /Notes and summaries/, /More than 10/);

    const matches = screen.getAllByTestId("quiz-match");
    expect(matches.map((m) => m.getAttribute("data-product"))).toEqual([
      "copper-notes",
    ]);
    const notes = getProducts().find((p) => p.id === "copper-notes")!;
    expect(matches[0]).toHaveTextContent(formatUsd(notes.priceUsd));
    const plus = getPlans().find((p) => p.id === "copper-plus")!;
    expect(screen.getByTestId("quiz-plus")).toHaveTextContent(
      `${formatUsd(plus.monthlyUsd)}/month`,
    );
    expect(
      within(screen.getByRole("dialog")).getByRole("link", {
        name: "See details",
      }),
    ).toHaveAttribute("href", "#products");
  });

  it("goes back a question and starts over", () => {
    render(<ProductQuiz products={getProducts()} plans={getPlans()} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Which product is right for me?" }),
    );
    answer("At home");
    expect(screen.getByRole("dialog")).toHaveTextContent("Question 2 of 3");
    answer("Back");
    expect(screen.getByRole("dialog")).toHaveTextContent("Question 1 of 3");
    answer("At home", /Running my lights/, "None");
    expect(screen.queryByTestId("quiz-plus")).toBeNull();
    answer("Start over");
    expect(screen.getByRole("dialog")).toHaveTextContent("Question 1 of 3");
  });
});
