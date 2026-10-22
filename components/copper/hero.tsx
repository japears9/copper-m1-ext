import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CUTOUT_SIZE, cutoutAlt } from "@/components/copper/product-images";
import { ProductQuiz } from "@/components/copper/product-quiz";
import { getPlans, getProducts } from "@/lib/copper/catalog";

export function Hero() {
  const products = getProducts();
  const home = products.find((p) => p.id === "copper-home");
  const notes = products.find((p) => p.id === "copper-notes");

  return (
    <section id="top" data-testid="hero" className="bg-secondary">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-heading text-4xl leading-tight font-bold text-balance sm:text-5xl">
            Practical AI for Arizona homes, desks and classrooms.
          </h1>
          <p className="text-muted-foreground text-xl">
            From raw ideas to refined answers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <a href="#products">See products</a>
            </Button>
            <ProductQuiz products={products} plans={getPlans()} />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          {home && (
            <Image
              src={home.cutout}
              alt={cutoutAlt(home)}
              width={CUTOUT_SIZE}
              height={CUTOUT_SIZE}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 28rem, 90vw"
              className="h-auto w-[85%]"
            />
          )}
          {notes && (
            <Image
              src={notes.cutout}
              alt={cutoutAlt(notes)}
              width={CUTOUT_SIZE}
              height={CUTOUT_SIZE}
              loading="eager"
              sizes="(min-width: 768px) 12rem, 40vw"
              className="absolute right-0 bottom-0 h-auto w-[45%] drop-shadow-xl"
            />
          )}
        </div>
      </div>
    </section>
  );
}
