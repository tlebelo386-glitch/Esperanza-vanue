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
  return (
    <div
      id={id}
      className={cn(
        "max-w-3xl scroll-mt-24",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-gold-gradient",
            align === "center" && "flex items-center justify-center gap-3"
          )}
        >
          {align === "center" && (
            <>
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/50" aria-hidden="true" />
              {eyebrow}
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/50" aria-hidden="true" />
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
