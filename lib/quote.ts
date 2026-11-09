import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import { intlLocale, type Dict, type Locale } from "@/lib/i18n";

export const EVENT_TYPES = ["mariage", "fiancailles", "henne", "reception", "entreprise", "domicile"] as const;
export const CUISINES = ["europeenne", "marocaine", "mixte"] as const;
export const FORMULAS = ["cocktail", "buffet", "servi", "animations"] as const;
export const SERVICES = ["service", "livraison"] as const;
export type EventType = (typeof EVENT_TYPES)[number];
export type QuoteFormula = (typeof FORMULAS)[number];
export type Service = (typeof SERVICES)[number];
export type Cuisine = (typeof CUISINES)[number];

export type Quote = {
  eventType: EventType;
  date: string;
  time: string;
  city: string;
  guests: string;
  cuisine: Cuisine;
  formulas: QuoteFormula[];
  service: Service;
  budget: string;
  name: string;
  phone: string;
  message: string;
};

export const bookedDates = new Set<string>(calendar.booked as string[]);
export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const isEventType = (v: string): v is EventType => (EVENT_TYPES as readonly string[]).includes(v);
export const isQuoteFormula = (v: string): v is QuoteFormula => (FORMULAS as readonly string[]).includes(v);

/** Date du jour au format AAAA-MM-JJ, en heure de Paris. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDay(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Récapitulatif envoyé sur WhatsApp, dans la langue du visiteur. */
export function quoteMessage(q: Quote, lang: Locale, d: Dict, ref: string) {
  const m = d.quote.message;
  const f = d.quote.fields;
  const c = lang === "fr" ? " :" : ":";
  const event = [
    `${m.event}${c} ${f.eventTypes[q.eventType]}`,
    `${m.date}${c} ${formatDay(q.date, lang)}`,
    q.time ? `${m.time}${c} ${q.time}` : "",
    `${m.city}${c} ${q.city}`,
    `${m.guests}${c} ${q.guests}`,
    `${m.cuisine}${c} ${f.cuisines[q.cuisine]}`,
    q.formulas.length ? `${m.formula}${c} ${q.formulas.map((x) => f.formulas[x]).join(", ")}` : "",
    `${m.service}${c} ${f.services[q.service]}`,
    q.budget ? `${m.budget}${c} ${q.budget}` : "",
  ];
  const contact = [`${m.name}${c} ${q.name}`, `${m.phone}${c} ${q.phone}`, q.message ? `${m.notes}${c} ${q.message}` : "", `${m.ref}${c} ${ref}`];
  return [[`*${m.title}*`], event, contact, [m.closing]].map((b) => b.filter(Boolean).join("\n")).join("\n\n");
}
