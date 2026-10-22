import Image from "next/image";
import { CUTOUT_SIZE, cutoutAlt } from "@/components/copper/product-images";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatUsd, getProducts } from "@/lib/copper/catalog";

// Swatch fill for each catalog color name. A name not listed here gets no swatch.
const SWATCHES: Record<string, string> = {
  "Polished Copper": "bg-copper",
  "Brushed Copper": "bg-copper",
  "Patina Teal": "bg-patina-teal",
  "Desert Sand": "bg-desert-sand",
  "Night Sky": "bg-night-sky",
};

export function Products() {
  const products = getProducts();

  return (
    <section id="products" data-testid="products">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Meet the products
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {products.map((product) => (
            <Card
              key={product.id}
              data-testid="product-card"
              data-product={product.id}
              className="gap-6 pt-0"
            >
              <div className="bg-secondary flex flex-col items-center gap-4 px-6 pt-6 pb-5">
                <Image
                  src={product.cutout}
                  alt={cutoutAlt(product)}
                  width={CUTOUT_SIZE}
                  height={CUTOUT_SIZE}
                  sizes="(min-width: 768px) 18rem, 80vw"
                  className="h-auto w-full max-w-72"
                />
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                  {product.colors.map((color) => (
                    <li key={color} className="flex items-center gap-1.5">
                      {SWATCHES[color] && (
                        <span
                          aria-hidden
                          className={`ring-foreground/40 size-4 rounded-full ring-1 ${SWATCHES[color]}`}
                        />
                      )}
                      {color}
                    </li>
                  ))}
                </ul>
              </div>

              <CardHeader className="gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
                    {product.name}
                  </CardTitle>
                  <p className="font-heading text-primary text-2xl font-semibold tracking-tight">
                    {formatUsd(product.priceUsd)}
                  </p>
                </div>
                <CardDescription className="text-base">
                  {product.type}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="flex flex-col gap-3 text-base">
                  {product.features.map((feature) => (
                    <li key={feature.name}>
                      <span className="font-semibold">{feature.name}.</span>{" "}
                      <span className="text-muted-foreground">
                        {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
