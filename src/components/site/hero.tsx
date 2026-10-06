import type { CSSProperties } from "react";
import Image from "next/image";
import { CalendarDays, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "./data";
import { WhatsAppIcon } from "./icons";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hi Esperanza, I'd like to enquire about a wedding date."
  )}`;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end justify-start overflow-hidden"
      aria-label="Esperanza Wedding Venue — hero"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/couple-dancing.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 35%" }}
        />
      </div>

      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.11 0.03 153 / 0.78) 0%, oklch(0.11 0.03 153 / 0.56) 48%, oklch(0.11 0.03 153 / 0.12) 100%), linear-gradient(180deg, oklch(0.11 0.03 153 / 0.3) 0%, transparent 28%, oklch(0.11 0.03 153 / 0.2) 58%, oklch(0.11 0.03 153 / 0.82) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pb-28 lg:pb-32">
        <p
          className="reveal-up inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-hero-foreground/85 sm:text-sm"
          style={delay(0)}
        >
          <MapPin className="size-3.5 text-accent" aria-hidden="true" />
          Mooiplaats <span className="text-hero-foreground/45">/</span> Pretoria East, Gauteng
        </p>

        <h1
          className="reveal-up mt-5 max-w-5xl text-balance font-serif text-6xl font-medium leading-[0.88] tracking-[-0.035em] text-hero-foreground sm:mt-7 sm:text-8xl lg:text-9xl"
          style={{ ...delay(120), textShadow: "0 2px 24px oklch(0.08 0.02 155 / 0.35)" }}
        >
          <span className="block">A wedding venue</span>
          <span className="mt-1 block">
            with a <em className="font-serif font-medium italic text-accent">difference.</em>
          </span>
        </h1>

        <p
          className="reveal-up mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-hero-foreground/90 sm:mt-7 sm:text-lg"
          style={{ ...delay(220), textShadow: "0 1px 12px oklch(0.08 0.02 155 / 0.55)" }}
        >
          A working equestrian farm beside the Pienaars River. Say your vows beneath the trees,
          celebrate in a barn strung with fairy lights, and let the horses and donkeys welcome your guests.
        </p>

        <p
          className="reveal-up mt-3 font-serif text-base italic leading-relaxed text-hero-foreground/80 sm:text-lg"
          style={{ ...delay(300), textShadow: "0 1px 8px oklch(0.08 0.02 155 / 0.5)" }}
        >
          &ldquo;ŉ Troue met &apos;n verskil — waar die plaas die fees is.&rdquo;
        </p>

        <div className="reveal-up mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row" style={delay(380)}>
          <Button
            asChild
            size="lg"
            className="group h-12 w-full rounded-full px-7 text-base shadow-gold-glow transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            <a href="#enquiry">
              <CalendarDays className="size-5 transition-transform group-hover:rotate-6" />
              Arrange a viewing
            </a>
          </Button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-hero-foreground/55 bg-hero-foreground/10 px-7 text-base font-medium text-hero-foreground backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-hero-foreground/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-auto"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp Marina
          </a>
        </div>

        <div
          className="reveal-up mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-hero-foreground/25 pt-4 text-xs text-hero-foreground/80 sm:mt-10 sm:gap-x-6 sm:pt-5 sm:text-sm"
          style={delay(480)}
        >
          <span>Working equestrian farm</span>
          <span className="text-hero-foreground/40" aria-hidden="true">·</span>
          <span>Beside the Pienaars River</span>
          <span className="text-hero-foreground/40" aria-hidden="true">·</span>
          <span>Viewings by appointment</span>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-hero-foreground/75 transition-colors hover:text-hero-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.2em]">
          Explore
          <ChevronDown className="size-4 animate-bounce motion-reduce:animate-none" />
        </span>
      </a>
    </section>
  );
}
