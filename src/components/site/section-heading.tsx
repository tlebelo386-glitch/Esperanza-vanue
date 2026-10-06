import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  id,
}: SectionHeadingProps) {
  const headingCopy = `${eyebrow ?? ""} ${title}`.toLowerCase();
  const motifSrc = /farm|animal|barn|accommodation|capacity|equestrian|horse|venue/i.test(headingCopy)
    ? "/images/farm-horseshoe-3d.png"
    : /chapel|ceremony|included|checklist|viewing|garden/i.test(headingCopy)
      ? "/images/wedding-bouquet-3d.png"
      : /package|story|love|testimonial|wedding|day|memory|entertainment|moment|faq|contact/i.test(headingCopy)
        ? "/images/love-rings-3d.png"
        : "/images/farm-botanical-3d.png";

  return (
    <div
      id={id}
      className={cn(
        "max-w-3xl scroll-mt-24",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <div
        className={cn("mb-3 flex", align === "center" ? "justify-center" : "justify-start")}
        aria-hidden="true"
      >
        <span className="grid size-14 place-items-center rounded-full border border-accent/30 bg-card/80 shadow-premium-sm">
          <Image
            src={motifSrc}
            alt=""
            width={52}
            height={52}
            className="size-11 object-contain drop-shadow-md"
          />
        </span>
      </div>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-gold-gradient",
            align === "center" && "flex items-center justify-center gap-3"
          )}
        >
          {align === "center" && (
            <>
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/50" aria-hidden="true" />
              {eyebrow}
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/50" aria-hidden="true" />
            </>
          )}
          {align === "left" && eyebrow}
        </p>
      )}
      <h2
        className="font-serif text-4xl font-medium leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl"
        style={{ textShadow: "0 2px 14px color-mix(in oklab, var(--foreground) 14%, transparent)" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-5 text-lg leading-relaxed text-muted-foreground text-balance sm:text-xl"
          style={{ textShadow: "0 1px 8px color-mix(in oklab, var(--foreground) 8%, transparent)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
