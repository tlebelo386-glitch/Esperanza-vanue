import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { EnquiryForm } from "./enquiry-form";
import { Newsletter } from "./newsletter";
import { Directions } from "./directions";
import { CONTACT } from "./data";
import { WhatsAppIcon } from "./icons";

export function Contact() {
  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hi Esperanza, I'd like to arrange a viewing."
  )}`;
  const mapEmbed = `https://www.google.com/maps?q=${CONTACT.mapQuery}&output=embed`;

  return (
    <section id="contact" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plan your visit"
          title="Come and experience Esperanza"
          description="The best way to picture your day is to walk the grounds. Viewings are by appointment; send us a WhatsApp or leave a note and we can arrange a time."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          <aside className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-premium-xl sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-full border border-accent/50 bg-primary-foreground/5 text-accent">
                <WhatsAppIcon className="size-6" aria-hidden="true" />
              </div>
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-accent">
                A good place to start
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                Let&apos;s find a day to show you around.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
                WhatsApp is the most reliable way to reach us at the farm. Tell us a little
                about what you&apos;re planning and we&apos;ll take it from there.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-premium transition hover:-translate-y-0.5 hover:shadow-premium-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <WhatsAppIcon className="size-5" aria-hidden="true" />
                Arrange a viewing
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>

              <div className="mt-8 grid gap-3 border-t border-primary-foreground/15 pt-6">
                <ContactRow
                  icon={Phone}
                  label="Call Marina"
                  value={CONTACT.phoneMarinaDisplay}
                  href={`tel:${CONTACT.phoneMarina.replace(/\s/g, "")}`}
                  inverted
                />
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={CONTACT.email}
                  href={`mailto:${CONTACT.email}`}
                  inverted
                />
                <ContactRow
                  icon={Clock}
                  label="Visits"
                  value="By appointment"
                  inverted
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-premium-lg">
              <iframe
                title="Map showing Esperanza Wedding Venue in Mooiplaats, Pretoria East"
                src={mapEmbed}
                className="h-64 w-full sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex items-start gap-3 p-5">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">Find us in Mooiplaats</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {CONTACT.addressShort}. Please request a pin before setting off; sat-nav can
                    be misleading in the smallholdings.
                  </p>
                </div>
              </div>
            </div>
            <Directions />
          </aside>

          <div className="flex flex-col gap-6">
            <div id="enquiry" className="scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-premium-lg sm:p-8">
              <div className="mb-6 max-w-xl">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Tell us about your plans
                </p>
                <h3 className="mt-2 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                  Start a conversation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Share what you have in mind, and we&apos;ll help you take the next step.
                </p>
              </div>
              <EnquiryForm />
            </div>
            <Newsletter />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  inverted = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  inverted?: boolean;
}) {
  const inner = (
    <div className="flex min-w-0 items-center gap-3 rounded-xl py-2 transition-colors">
      <span
        className={
          inverted
            ? "grid size-9 shrink-0 place-items-center rounded-full border border-primary-foreground/20 text-accent"
            : "grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
        }
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span
          className={
            inverted
              ? "block text-xs text-primary-foreground/65"
              : "block text-xs text-muted-foreground"
          }
        >
          {label}
        </span>
        <span
          className={
            inverted
              ? "block break-words text-sm font-medium text-primary-foreground"
              : "block break-words text-sm font-medium text-foreground"
          }
        >
          {value}
        </span>
      </span>
    </div>
  );

  return href ? (
    <a
      href={href}
      className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {inner}
    </a>
  ) : (
    inner
  );
}
