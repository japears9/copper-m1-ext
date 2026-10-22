import Image from "next/image";
import { lifestylePhoto } from "@/components/copper/product-images";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/copper/catalog";

export function Showcase() {
  // Every described lifestyle photo, product by product, in catalog order.
  const rows = getProducts().flatMap((product) =>
    product.lifestyle.flatMap((src) => {
      const photo = lifestylePhoto(src);
      return photo ? [{ product, src, photo }] : [];
    }),
  );

  return (
    <section id="showcase" data-testid="showcase" className="bg-secondary">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Made for Arizona life
        </h2>
        <div className="mt-10 flex flex-col gap-12 md:gap-16">
          {rows.map(({ product, src, photo }, i) => (
            <figure
              key={src}
              data-product={product.id}
              className="grid items-center gap-5 md:grid-cols-5 md:gap-10"
            >
              <Image
                src={src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 768px) 36rem, 100vw"
                className={cn(
                  "h-auto w-full rounded-xl shadow-md md:col-span-3",
                  i % 2 === 1 && "md:order-last",
                )}
              />
              <figcaption className="flex flex-col gap-2 md:col-span-2">
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">
                  {product.name}
                </span>
                <span className="text-xl leading-snug">{photo.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
