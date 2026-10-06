import Image from "next/image";
import { Leaf, Wallet, MapPinned } from "lucide-react";
import { HorseIcon as Horse } from "./icons";

const VALUE_PROPS = [
  {
    icon: Wallet,
    title: "Affordable & flexible",
    body:
      "Self-catering or full-service. Bring your own caterer, alcohol and décor, or let us quote to your budget. No expensive vendor lock-in.",
  },
  {
    icon: Leaf,
    title: "A genuine working farm",
    body:
      "Not a manicured formal venue. Real stables, real paddocks, real dust — the kind of countryside character a city venue can only fake.",
  },
  {
    icon: Horse,
    title: "Animals are the signature",
    body:
      "Horses, donkeys, cows, calves, sheep and peacocks walk the property. Donkeys serve your welcome drinks. Horses carry the bride down the aisle.",
  },
  {
    icon: MapPinned,
    title: "Multiple settings, one booking",
    body:
      "Forest, dam, stables and garden — all four ceremony settings on one property. Pair any ceremony with any reception. No venue-hopping.",
  },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-primary py-16 text-primary-foreground sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-accent/40 bg-card shadow-2xl ring-1 ring-primary-foreground/10 sm:rounded-3xl">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upgrade_wedding_farm_logo_2K_20261006220341-x7uqaaM2ETC8UMuZAAalbHbFu9KjcJ.jpg"
            alt="Esperanza Equestrian Centre & Venue sign, framed by horses, flowers and the farm entrance"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-xs uppercase tracking-[0.2em] text-primary-foreground sm:p-7">
            <span className="rounded-full border border-primary-foreground/30 bg-primary/75 px-4 py-2 backdrop-blur-sm">
              Pretoria East · A place to celebrate
            </span>
            <span className="hidden font-serif text-lg italic tracking-normal text-accent sm:block">
              ŉ Regte plaas met &apos;n regte hart
            </span>
          </figcaption>
        </figure>

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:mt-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">
              A personal welcome
            </p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-tight text-balance sm:text-5xl">
              Welcome to Esperanza
            </h2>
            <p className="mt-4 font-serif text-xl italic text-primary-foreground/75 sm:text-2xl">
              A working farm, a genuine welcome, and room for your story.
            </p>
          </div>

          <div className="border-l border-accent/50 pl-6 sm:pl-8">
            <p className="text-lg leading-relaxed text-primary-foreground/90 sm:text-xl">
              We&apos;re delighted to welcome you to Esperanza. Our farm is a place where the
              countryside sets the pace, animals are part of everyday life, and every celebration
              feels a little more personal.
            </p>
            <p className="mt-5 text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
              As directors, it means a great deal to share this special place with you. Whether
              you&apos;re here to celebrate a wedding or gather with the people who matter most, we
              hope you feel at home from the moment you arrive. We look forward to welcoming you
              and helping you make your day your own.
            </p>
            <div className="mt-8 border-t border-primary-foreground/20 pt-6">
              <p className="font-serif text-lg italic text-accent">With warm regards,</p>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground">
                The Directors
              </p>
              <p className="mt-1 text-sm text-primary-foreground/65">
                Esperanza Equestrian Centre &amp; Venue
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-x-8 gap-y-8 border-t border-primary-foreground/20 pt-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {VALUE_PROPS.map((vp) => (
            <article key={vp.title} className="group">
              <span className="grid size-11 place-items-center rounded-full border border-accent/50 bg-primary-foreground/5 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <vp.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-primary-foreground">
                {vp.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                {vp.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
