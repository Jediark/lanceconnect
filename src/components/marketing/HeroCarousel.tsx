import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { IMG } from "@/data/content";

const SLIDES = [
  { img: IMG.heroFreelancer, kicker: "Lagos, Nigeria", title: "Taiwo found his first 3 web-dev clients in week one.", meta: "Web Developer · Free plan" },
  { img: IMG.marketStall,   kicker: "Naples, Italy",  title: "Sofia turned a local market into a portfolio of 8 brands.", meta: "Designer · Starter plan" },
  { img: IMG.coffeeShop,    kicker: "Buenos Aires, Argentina", title: "Lucas books 2 discovery calls a day from coffee shops.", meta: "Copywriter · Pro plan" },
  { img: IMG.workspace,     kicker: "Mumbai, India",  title: "Priya replaced her 9-to-5 in 5 months of freelance SEO.", meta: "SEO Specialist · Pro plan" },
  { img: IMG.team,          kicker: "Toronto, Canada", title: "Alex grew an agency of 4 — every lead from LanceConnect.", meta: "Agency owner · Agency plan" },
];

export function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    const id = setInterval(() => embla.scrollNext(), 5500);
    return () => { embla.off("select", onSelect); clearInterval(id); };
  }, [embla]);

  return (
    <section className="border-b border-border bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Real freelancers · Real cities
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Stories from the people we built this for
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => embla?.scrollPrev()} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => embla?.scrollNext()} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="mt-10 overflow-hidden">
          <div className="flex -ml-5">
            {SLIDES.map((s) => (
              <div key={s.title} className="min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-[80%] md:basis-[60%] lg:basis-[48%]">
                <article className="group relative overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden">
                    <img src={s.img} alt={s.title} loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                        <MapPin className="h-3 w-3" /> {s.kicker}
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-semibold leading-tight md:text-3xl">{s.title}</h3>
                      <p className="mt-2 text-xs uppercase tracking-widest text-white/80">{s.meta}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-foreground" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
