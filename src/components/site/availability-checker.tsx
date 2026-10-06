"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import { CONTACT } from "./data";
import { WhatsAppIcon } from "./icons";
import { cn } from "@/lib/utils";

type AvailabilityStatus = "open" | "held" | "booked" | "limited" | "unknown";

export interface AvailableDate {
  date: string;
  status: string;
  isWeekend: boolean;
  discount: number | null;
  note: string | null;
}

interface AvailabilityCheckerProps {
  availableDates: AvailableDate[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" });
const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-ZA", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  open: "Available",
  held: "On hold",
  booked: "Booked",
  limited: "Limited availability",
  unknown: "Not yet listed",
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthDays(month: Date) {
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? new Date(month.getFullYear(), month.getMonth(), day) : null;
  });
  return Array.from({ length: 6 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
}

async function fetchAvailableDates(url: string): Promise<AvailableDate[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Availability could not be loaded.");
  const payload = (await response.json()) as { dates?: AvailableDate[] };
  return payload.dates ?? [];
}

export function AvailabilityChecker({ availableDates }: AvailabilityCheckerProps) {
  const { data, isLoading, error } = useSWR(
    "/api/available-dates?status=all&weeks=52",
    fetchAvailableDates,
    {
      fallbackData: availableDates,
      refreshInterval: 60_000,
      revalidateOnFocus: true,
    }
  );
  const liveAvailableDates = data ?? availableDates;
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState("");
  const lastAvailableMonth = new Date(today.getFullYear(), today.getMonth() + 12, 1);

  const datesByKey = useMemo(
    () => new Map(liveAvailableDates.map((date) => [date.date.slice(0, 10), date])),
    [liveAvailableDates]
  );
  const weeks = useMemo(() => getMonthDays(month), [month]);
  const selectedRecord = selectedDate ? datesByKey.get(selectedDate) : undefined;
  const status = (selectedRecord?.status as AvailabilityStatus | undefined) ?? "unknown";
  const isBeforeCurrentMonth =
    month.getFullYear() === today.getFullYear() && month.getMonth() <= today.getMonth();
  const isAfterAvailabilityWindow = month >= lastAvailableMonth;

  const upcomingOpenDates = useMemo(
    () =>
      liveAvailableDates
        .filter((date) => date.status === "open" && date.date.slice(0, 10) >= formatDateKey(today))
        .sort((first, second) => first.date.localeCompare(second.date))
        .slice(0, 3),
    [liveAvailableDates, today]
  );

  const formattedSelectedDate = selectedDate
    ? LONG_DATE_FORMATTER.format(new Date(`${selectedDate}T12:00:00`))
    : "Choose a date to see its status";

  const whatsappLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    selectedDate
      ? `Hi Esperanza, could you confirm availability for ${formattedSelectedDate}?`
      : "Hi Esperanza, I'd like to check availability for a wedding date."
  )}`;

  function chooseDate(dateKey: string) {
    setSelectedDate(dateKey);
  }

  function showMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function getDayStatus(dateKey: string): AvailabilityStatus {
    const record = datesByKey.get(dateKey);
    if (!record) return "unknown";
    if (record.status === "open" || record.status === "held" || record.status === "booked" || record.status === "limited") {
      return record.status;
    }
    return "unknown";
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-premium-lg">
      <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.88fr)]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> Live date calendar
              </p>
<h3
                    className="mt-2 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
                    style={{ textShadow: "0 2px 12px color-mix(in oklab, var(--foreground) 12%, transparent)" }}
                  >
                    Find your day
                  </h3>
                  <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                Select a date to see its current status. Open dates are updated by our venue team.
              </p>
              <p aria-live="polite" className="mt-1 text-xs text-muted-foreground">
                {isLoading ? "Checking the latest venue availability…" : error ? "Availability couldn’t be refreshed. Please contact the venue to confirm." : "Live availability · refreshed automatically"}
              </p>
            </div>
            <span className="hidden size-11 shrink-0 place-items-center rounded-2xl bg-primary/8 text-primary sm:grid">
              <CalendarDays className="size-5" />
            </span>
          </div>

          <div className="mt-7 flex items-center justify-between gap-3">
            <div aria-live="polite">
              <p className="font-serif text-lg font-semibold text-foreground">{MONTH_FORMATTER.format(month)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Choose a day to view availability</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => showMonth(-1)}
                disabled={isBeforeCurrentMonth}
                aria-label="Previous month"
                className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => showMonth(1)}
                disabled={isAfterAvailabilityWindow}
                aria-label="Next month"
                className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div role="grid" aria-label={`${MONTH_FORMATTER.format(month)} availability`} className="mt-4">
            <div role="row" className="grid grid-cols-7 pb-2">
              {WEEKDAYS.map((weekday) => (
                <div key={weekday} role="columnheader" className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {weekday}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} role="row" className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => {
                    if (!day) return <div key={`empty-${weekIndex}-${dayIndex}`} role="gridcell" aria-hidden="true" />;
                    const dateKey = formatDateKey(day);
                    const dayStatus = getDayStatus(dateKey);
                    const isPast = day < today;
                    const isSelected = selectedDate === dateKey;
                    const isToday = dateKey === formatDateKey(today);
                    const record = datesByKey.get(dateKey);
                    const isOpen = dayStatus === "open";
                    const isHeld = dayStatus === "held" || dayStatus === "limited";
                    const isBooked = dayStatus === "booked";
                    return (
                      <div key={dateKey} role="gridcell" aria-selected={isSelected}>
                        <button
                          type="button"
                          disabled={isPast}
                          aria-label={`${LONG_DATE_FORMATTER.format(day)} — ${isPast ? "past date" : STATUS_LABELS[dayStatus]}${record?.note ? `, ${record.note}` : ""}`}
                          aria-pressed={isSelected}
                          title={record?.note ?? STATUS_LABELS[dayStatus]}
                          onClick={() => chooseDate(dateKey)}
                          className={cn(
                            "relative flex aspect-square w-full flex-col items-center justify-center gap-0.5 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                            isPast && "cursor-not-allowed text-muted-foreground/35",
                            !isPast && !isSelected && "text-foreground hover:bg-muted",
                            isToday && !isSelected && "font-semibold ring-1 ring-inset ring-primary/40",
                            isOpen && !isSelected && "font-semibold text-primary",
                            isHeld && !isSelected && "bg-accent/10 text-foreground",
                            isBooked && !isSelected && "text-muted-foreground line-through decoration-border",
                            dayStatus === "unknown" && !isPast && "text-foreground/80",
                            isSelected && "bg-primary font-semibold text-primary-foreground shadow-sm"
                          )}
                        >
                          <span>{day.getDate()}</span>
                          {isOpen && !isSelected && <span className="size-1 rounded-full bg-primary" aria-hidden="true" />}
                          {isHeld && !isSelected && <span className="size-1 rounded-full bg-accent" aria-hidden="true" />}
                          {isBooked && !isSelected && <span className="size-1 rounded-full bg-muted-foreground/50" aria-hidden="true" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-[11px] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Available</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> On hold</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/50" /> Booked</span>
            <span className="inline-flex items-center gap-1.5"><CircleHelp className="size-3" /> Not listed</span>
          </div>

          {upcomingOpenDates.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Next open dates</p>
              <div className="flex flex-wrap gap-2">
                {upcomingOpenDates.map((date) => (
                  <button
                    key={date.date}
                    type="button"
                    onClick={() => {
                      const parsed = new Date(`${date.date.slice(0, 10)}T12:00:00`);
                      setMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
                      chooseDate(date.date.slice(0, 10));
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5",
                      selectedDate === date.date.slice(0, 10) ? "border-primary bg-primary/8 text-primary" : "border-border text-foreground/75"
                    )}
                  >
                    {SHORT_DATE_FORMATTER.format(new Date(`${date.date.slice(0, 10)}T12:00:00`))}
                    {date.discount ? <span className="ml-1.5 text-primary">−{date.discount}%</span> : null}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col border-t border-border bg-muted/35 p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your selected date</p>
            <span className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold",
              selectedDate && status === "open" ? "bg-primary/10 text-primary" :
                selectedDate && (status === "held" || status === "limited") ? "bg-accent/15 text-foreground" :
                  selectedDate && status === "booked" ? "bg-muted text-muted-foreground" : "bg-background text-muted-foreground"
            )}>
              {selectedDate ? STATUS_LABELS[status] : "Select a date"}
            </span>
          </div>

          <div className="mt-5 min-h-24">
            {selectedDate ? (
              <>
                <p className="font-serif text-2xl font-semibold leading-tight text-foreground">{formattedSelectedDate}</p>
                {selectedRecord?.discount ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary"><Sparkles className="size-3.5" />{selectedRecord.discount}% weekday offer</p>
                ) : null}
                {selectedRecord?.note ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedRecord.note}</p> : null}
              </>
            ) : (
              <p className="font-serif text-2xl font-medium leading-tight text-foreground">A day worth looking forward to.</p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-border/80 bg-card p-4">
            {selectedDate && status === "open" ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Check className="size-4" /> This date is currently open</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Send us a note and our team will confirm the details and next steps with you personally.</p>
              </>
            ) : selectedDate && (status === "held" || status === "limited") ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Clock3 className="size-4 text-accent" /> This date is on hold</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">A date enquiry is already in progress. Ask us about its current status or nearby open dates.</p>
              </>
            ) : selectedDate && status === "booked" ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays className="size-4 text-muted-foreground" /> This date is booked</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Let us help you find another day with the same atmosphere and setting.</p>
              </>
            ) : selectedDate ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CircleHelp className="size-4 text-accent" /> This date is not listed yet</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">We don&apos;t have a published status for this day. Message the venue team for a personal confirmation.</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays className="size-4 text-primary" /> Availability, at a glance</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Open dates are marked in green. Dates without a status haven&apos;t been published to the calendar yet.</p>
              </>
            )}
          </div>

          <div className="mt-auto pt-6">
            <a
              href={selectedDate && status === "booked" ? "#availability" : `#enquiry`}
              onClick={() => {
                if (selectedDate && status === "booked") setSelectedDate("");
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              {selectedDate && status === "booked" ? "Browse another date" : "Enquire about this date"}
              <ArrowRight className="size-4" />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground/75 transition-colors hover:bg-background"
            >
              <WhatsAppIcon className="size-4" /> Ask us on WhatsApp
            </a>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] leading-relaxed text-muted-foreground">
              <MapPin className="size-3 shrink-0" /> {CONTACT.addressShort} <span aria-hidden="true">·</span> A real person confirms every date
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
