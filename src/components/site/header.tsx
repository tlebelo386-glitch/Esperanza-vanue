"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  MapPin,
  Menu,
  Star,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, CONTACT, BRAND_ASSETS } from "./data";
import { cn } from "@/lib/utils";
import { ScrollProgress, ActiveSectionStyles } from "./scroll-progress";
import { useScrollState } from "./use-scroll-state";

const PRIMARY_LINKS = NAV_LINKS.filter(({ href }) =>
  ["#about", "#chapels", "#packages", "#gallery"].includes(href)
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const { progress, activeSection } = useScrollState();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      setExploreOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeTray = () => {
    setMobileOpen(false);
    setExploreOpen(false);
  };

  return (
    <>
      <ScrollProgress progress={progress} />
      <ActiveSectionStyles activeSection={activeSection} />
      <header
        className={cn(
          "fixed left-1/2 top-3 z-50 w-[calc(100%-1.25rem)] max-w-7xl -translate-x-1/2 rounded-full border backdrop-blur-2xl transition-all duration-300",
          scrolled
            ? "border-border/80 bg-background/95 shadow-premium-lg"
            : "border-white/35 bg-background/85 shadow-premium"
        )}
      >
        <div className="flex min-h-14 items-center justify-between gap-2 px-3 sm:min-h-16 sm:px-5 lg:px-6">
          <Link
            href="#top"
            onClick={closeTray}
            className="group flex min-w-0 shrink-0 items-center gap-2.5"
            aria-label="Esperanza Wedding Venue — home"
          >
            <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/20 sm:size-10">
              <Image
                src={BRAND_ASSETS.logo3dSign}
                alt=""
                fill
                sizes="40px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-base font-semibold tracking-tight text-foreground sm:text-lg">
                Esperanza
              </span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[9px]">
                Pretoria East · Gauteng
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {PRIMARY_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-target={link.href}
                aria-current={activeSection === link.href ? "location" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                  activeSection === link.href
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
            <div className="relative">
              <button
                type="button"
                aria-expanded={exploreOpen}
                aria-controls="explore-tray"
                onClick={() => setExploreOpen((value) => !value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                  exploreOpen
                    ? "bg-primary/8 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                Explore
                <ChevronDown className={cn("size-3.5 transition-transform", exploreOpen && "rotate-180")} />
              </button>
              {exploreOpen && (
                <div
                  id="explore-tray"
                  className="absolute right-0 top-full mt-4 w-[min(34rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-premium-xl"
                >
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Esperanza, at a glance</p>
                      <p className="mt-1 font-serif text-xl text-foreground">Make yourself at home.</p>
                    </div>
                    <MapPin className="mb-1 size-4 text-accent" aria-hidden="true" />
                  </div>
                  <nav aria-label="Explore Esperanza" className="grid grid-cols-2 gap-1">
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={closeTray}
                        className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-foreground/75 transition-colors hover:bg-muted hover:text-primary"
                      >
                        {link.label}
                        <ArrowDownRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:opacity-100" />
                      </a>
                    ))}
                  </nav>
                  <a
                    href="#availability"
                    onClick={closeTray}
                    className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <span className="flex items-center gap-2"><CalendarDays className="size-4" />Check your date</span>
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              )}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="#availability"
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 sm:inline-flex"
            >
              <CalendarDays className="size-4" />
              <span className="hidden xl:inline">Check dates</span>
              <span className="xl:hidden">Dates</span>
            </a>
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                    className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                  >
                    {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[min(90vw,25rem)] gap-0 border-l border-border bg-background p-0">
                  <SheetTitle className="sr-only">Esperanza navigation</SheetTitle>
                  <div className="flex h-full flex-col">
                    <div className="border-b border-border px-6 pb-5 pt-8">
                      <div className="flex items-center gap-3">
                        <span className="relative size-12 overflow-hidden rounded-full ring-1 ring-primary/20">
                          <Image src={BRAND_ASSETS.logo3dSign} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                        <div>
                          <p className="font-serif text-xl font-semibold text-foreground">Esperanza</p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">A farm venue with a difference</p>
                        </div>
                      </div>
                      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 text-accent" /> Pretoria East, Gauteng
                      </p>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile navigation">
                      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore the venue</p>
                      <div className="grid grid-cols-2 gap-1">
                        {NAV_LINKS.map((link) => {
                          const isActive = activeSection === link.href;
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              onClick={closeTray}
                              aria-current={isActive ? "location" : undefined}
                              className={cn(
                                "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                                isActive ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted hover:text-foreground"
                              )}
                            >
                              {link.label}
                            </a>
                          );
                        })}
                      </div>
                      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Star className="size-4 fill-accent text-accent" />
                          {CONTACT.stats.rating} on Google
                        </div>
                        <p className="mt-1 pl-6 text-xs text-muted-foreground">{CONTACT.stats.reviewCount} couples have shared their experience</p>
                      </div>
                    </nav>
                    <div className="border-t border-border bg-card/70 p-5">
                      <a
                        href="#availability"
                        onClick={closeTray}
                        className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <CalendarDays className="size-4" /> Check availability
                        <ArrowRight className="size-4" />
                      </a>
                      <a
                        href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi Esperanza, I'd like to enquire about a wedding date.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeTray}
                        className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground/75 transition-colors hover:bg-muted"
                      >
                        WhatsApp {CONTACT.phoneMarinaDisplay}
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
