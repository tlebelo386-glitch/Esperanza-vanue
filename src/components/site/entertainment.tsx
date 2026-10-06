import Image from "next/image";
import { Music, Mic, Disc3, Sparkles, Gamepad2, Waves } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { ENTERTAINMENT } from "./data";
import { HorseIcon, CartIcon } from "./icons";

const ICONS = [
  Disc3,
  Mic,
  Sparkles,
  CartIcon,
  HorseIcon,
  Music,
  Gamepad2,
  Waves,
];

export function Entertainment() {
  return (
    <section id="entertainment" className="scroll-mt-20 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Entertainment & add-ons"
          title="We arrange the music, too"
          description="Couples don't have to source DJs, live bands or unusual add-ons from scratch — we book and coordinate the entertainment ourselves, so the day stays cohesive. Pick any combination below; we'll quote to your budget."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENTERTAINMENT.map((item, i) => {
            const Icon = ICONS[i % ICONS.length] ?? Music;
            return (
              <article
                key={item}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="pt-1 text-sm font-medium leading-snug text-foreground">{item}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-80">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-Au9U7XeIrUXkQxmfdijKW8qKBIEdgZ.jpg"
              alt="Children enjoy a hands-on craft activity together inside the farm barn"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">For every generation</p>
            <h3
              className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground sm:text-4xl"
              style={{ textShadow: "0 2px 12px color-mix(in oklab, var(--foreground) 12%, transparent)" }}
            >
              Little guests, lasting memories
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              From hands-on barn activities to pony rides and open-air games, younger guests have room to explore while the grown-ups celebrate.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
              <Music className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Want a band you&apos;ve already chosen?
              </h3>
              <p className="text-sm text-muted-foreground">
                Bring your own — we happily coordinate with outside DJs, bands and singers too.
              </p>
            </div>
          </div>
          <a
            href="#enquiry"
            className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tell us your line-up
          </a>
        </div>
      </div>
    </section>
  );
}
