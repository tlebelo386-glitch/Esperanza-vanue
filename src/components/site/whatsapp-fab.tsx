"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { CONTACT } from "./data";
import { cn } from "@/lib/utils";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contactSection = document.getElementById("contact");
    const observer = contactSection
      ? new IntersectionObserver(
          ([entry]) => setContactVisible(entry.isIntersecting),
          { threshold: 0.08 }
        )
      : null;
    if (contactSection) observer?.observe(contactSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hi Esperanza, I'd like to enquire about a wedding date."
  )}`;
  const phoneLink = `tel:${CONTACT.phoneMarina.replace(/\s/g, "")}`;

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-40 flex items-center gap-2 transition-all duration-300 lg:bottom-6 lg:right-6",
        show && !contactVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
      aria-label="Quick contact"
    >
      <a
        href={phoneLink}
        aria-label={`Call Esperanza at ${CONTACT.phoneMarinaDisplay}`}
        title="Call Esperanza"
        className="grid size-11 place-items-center rounded-full border border-border bg-card text-primary shadow-premium transition hover:-translate-y-0.5 hover:shadow-premium-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:size-12"
      >
        <Phone className="size-5" aria-hidden="true" />
      </a>
      <a
        href={`mailto:${CONTACT.email}`}
        aria-label={`Email Esperanza at ${CONTACT.email}`}
        title="Email Esperanza"
        className="grid size-11 place-items-center rounded-full border border-border bg-card text-primary shadow-premium transition hover:-translate-y-0.5 hover:shadow-premium-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:size-12"
      >
        <Mail className="size-5" aria-hidden="true" />
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Esperanza Wedding Venue"
        className="hidden h-12 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-premium-lg transition hover:-translate-y-0.5 hover:shadow-premium-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:flex"
      >
        <WhatsAppIcon className="size-5" aria-hidden="true" />
        <span className="text-sm font-medium">WhatsApp Marina</span>
      </a>
    </div>
  );
}
