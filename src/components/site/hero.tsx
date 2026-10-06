"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, ChevronDown, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "./data";
import { WhatsAppIcon } from "./icons";

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      el.style.transform = `translate3d(0, ${y * 0.2}px, 0) scale(1.06)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hi Esperanza, I'd like to enquire about a wedding date."
  )}`;

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      aria-label="Esperanza Wedding Venue — hero"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: "scale(1.06)" }}
        aria-hidden="true"
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LMP%20Kemp%20Troue-845-n47TltDQyyOmOfHgV3ySYAQBqGN7Kd.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
      </div>

      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.025 155 / 0.58) 0%, oklch(0.12 0.025 155 / 0.42) 42%, oklch(0.12 0.025 155 / 0.83) 100%), radial-gradient(ellipse 80% 58% at 50% 44%, oklch(0.12 0.025 155 / 0.18) 0%, oklch(0.12 0.025 155 / 0.48) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 bg-gradient-to-t from-foreground/30 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-28 text-center sm:px-8 sm:pb-28 sm:pt-32">
        <p
          className="reveal-up inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85 sm:text-sm"
          style={delay(0)}
        >
          <MapPin className="size-3.5 text-accent" aria-hidden="true" />
          Pretoria East <span className="text-white/45">/</span> Gauteng
        </p>

        <h1
          className="reveal-up mx-auto mt-6 max-w-5xl text-balance font-serif text-5xl font-medium leading-[0.95] tracking-[-0.035em] text-white sm:mt-8 sm:text-7xl lg:text-8xl"
          style={{ ...delay(120), textShadow: "0 2px 24px oklch(0.08 0.02 155 / 0.35)" }}
        >
          <span className="block">A wedding venue</span>
          <span className="mt-1 block">
            with a <em className="font-serif font-medium italic text-accent">difference.</em>
          </span>
        </h1>

        <p
          className="reveal-up mx-auto mt-6 max-w-2xl text-pretty text-sm leading-relaxed text-white/90 sm:mt-7 sm:text-lg"
          style={{ ...delay(260), textShadow: "0 1px 12px oklch(0.08 0.02 155 / 0.55)" }}
        >
          A working equestrian farm beside the Pienaars River. Say your vows beneath the trees,
          celebrate in a barn strung with fairy lights, and let the horses and donkeys welcome your guests.
        </p>

        <p
          className="reveal-up mx-auto mt-4 font-serif text-lg italic leading-relaxed text-white/85 sm:text-xl"
          style={{ ...delay(360), textShadow: "0 1px 8px oklch(0.08 0.02 155 / 0.5)" }}
        >
          &ldquo;ŉ Troue met &apos;n verskil — waar die plaas die fees is.&rdquo;
        </p>

        <div
          className="reveal-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={delay(460)}
        >
          <Button
            asChild
            size="lg"
            className="group h-12 w-full rounded-full px-7 text-base shadow-gold-glow transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            <a href="#enquiry">
              <Calendar className="size-5 transition-transform group-hover:rotate-6" />
              Book a viewing
            </a>
          </Button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/55 bg-white/10 px-7 text-base font-medium text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-auto"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp Marina
          </a>
        </div>

        <div
          className="reveal-up mx-auto mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/25 pt-5 text-xs text-white/85 sm:mt-11 sm:text-sm"
          style={delay(580)}
        >
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
            <strong className="font-semibold text-white">{CONTACT.stats.rating}/5</strong>
            <span>on Google</span>
          </span>
          <span className="hidden text-white/45 sm:inline" aria-hidden="true">·</span>
          <span>{CONTACT.stats.reviewCount} couple reviews</span>
          <span className="hidden text-white/45 sm:inline" aria-hidden="true">·</span>
          <span>Self-catering or full-service</span>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.2em]">
          Explore
          <ChevronDown className="size-4 animate-bounce motion-reduce:animate-none" />
        </span>
      </a>
    </section>
  );
}
