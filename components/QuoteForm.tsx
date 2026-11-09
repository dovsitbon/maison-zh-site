"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { depositUrl } from "@/lib/payment";
import { bookedDates, CUISINES, EVENT_TYPES, FORMULAS, isEventType, isoDay, quoteMessage, SERVICES, waLink, type Cuisine, type EventType, type QuoteFormula, type Service } from "@/lib/quote";
import { isPhone } from "@/lib/validate";

type Key = "date" | "city" | "guests" | "name" | "phone";
type Errors = Partial<Record<Key, string>>;

function Field({ id, label, error, hint, children }: { id: string; label: ReactNode; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[0.8125rem] text-green">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8125rem] text-terra-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 flex items-center gap-3">
        <span className="num flex h-8 w-8 items-center justify-center rounded-full border border-gold text-[0.9375rem] text-ink">{n}</span>
        <span className="display text-[1.5rem]">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

/** Demande de devis courte, qui qualifie la demande, envoyée en récapitulatif sur WhatsApp dans la langue du visiteur. */
export function QuoteForm() {
  const { lang, d, prefill } = useLocale();
  const f = d.quote.fields;
  const id = (k: string) => `q-${k}`;

  const [eventType, setEventType] = useState<EventType>("mariage");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");
  const [cuisine, setCuisine] = useState<Cuisine>("mixte");
  const [picked, setPicked] = useState<QuoteFormula[]>([]);
  const [service, setService] = useState<Service>("service");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue côté client
  useEffect(() => setToday(isoDay(new Date())), []);

  // Pré-remplissage depuis le hero, une tuile d'événement ou une carte de formule
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- synchronisation avec le choix fait plus haut */
    if (prefill.guests) setGuests(prefill.guests);
    if (prefill.formula) setPicked((p) => (p.includes(prefill.formula as QuoteFormula) ? p : [...p, prefill.formula as QuoteFormula]));
    if (prefill.cuisine) setCuisine(prefill.cuisine);
    if (prefill.eventType && isEventType(prefill.eventType)) setEventType(prefill.eventType);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [prefill]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = d.quote.required;
    if (!city.trim()) e.city = d.quote.required;
    if (!guests.replace(/\D/g, "")) e.guests = d.quote.required;
    if (!name.trim()) e.name = d.quote.required;
    if (!phone.trim()) e.phone = d.quote.required;
    else if (!isPhone(phone)) e.phone = d.quote.invalidPhone;
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = (["date", "city", "guests", "name", "phone"] as const).find((k) => e[k]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const ref = `ZH-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const text = quoteMessage({ eventType, date, time, city: city.trim(), guests: guests.replace(/\D/g, ""), cuisine, formulas: FORMULAS.filter((x) => picked.includes(x)), service, budget, name: name.trim(), phone: phone.trim(), message: message.trim() }, lang, d, ref);
    const url = waLink(text);
    // Ouvert pendant le clic, pour ne pas être bloqué comme fenêtre surgissante
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  const err = (k: Key) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const booked = date !== "" && bookedDates.has(date);

  if (sent) {
    return (
      <div className="rounded-3xl bg-ivory p-8 text-center md:p-12" role="status">
        <h3 className="display text-[2rem]">{d.quote.success.title}</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.quote.success.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={sent} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon className="h-5 w-5" />
            {d.quote.success.again}
          </a>
          {depositUrl && (
            <a href={depositUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {d.quote.deposit}
            </a>
          )}
          <button type="button" onClick={() => setSent(null)} className="link-line min-h-11 text-[0.9375rem]">
            {d.quote.success.reset}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10 rounded-3xl bg-ivory p-5 sm:p-8 md:p-10">
      {prefill.guests && guests === prefill.guests && (
        <p className="rounded-2xl bg-gold-soft px-4 py-3 text-[0.9375rem]" role="status">
          {fill(d.quote.prefilled, { n: prefill.guests })}
        </p>
      )}

      <Step n="1" title={d.quote.steps.event}>
        <div>
          <p className="label" id={id("type")}>
            {f.eventType}
          </p>
          <div role="radiogroup" aria-labelledby={id("type")} className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <label key={t} className="chip">
                <input type="radio" name="eventType" value={t} checked={eventType === t} onChange={() => setEventType(t)} className="sr-only" />
                {f.eventTypes[t]}
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("date")} label={`${f.date} *`} error={errors.date} hint={booked ? f.dateBooked : undefined}>
            <input id={id("date")} type="date" required min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" {...err("date")} />
          </Field>
          <Field id={id("time")} label={`${f.time} (${f.optional})`}>
            <input id={id("time")} type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field" />
          </Field>
          <Field id={id("city")} label={`${f.city} *`} error={errors.city}>
            <input id={id("city")} type="text" autoComplete="address-level2" placeholder={f.cityPlaceholder} value={city} onChange={(e) => setCity(e.target.value)} className="field" maxLength={120} {...err("city")} />
          </Field>
          <Field id={id("guests")} label={`${f.guests} *`} error={errors.guests}>
            <input id={id("guests")} type="number" inputMode="numeric" min={1} max={5000} value={guests} onChange={(e) => setGuests(e.target.value)} className="field num" {...err("guests")} />
          </Field>
        </div>
      </Step>

      <Step n="2" title={d.quote.steps.menu}>
        <div>
          <p className="label" id={id("cuisine")}>
            {f.cuisine}
          </p>
          <div role="radiogroup" aria-labelledby={id("cuisine")} className="flex flex-wrap gap-2">
            {CUISINES.map((x) => (
              <label key={x} className="chip">
                <input type="radio" name="cuisine" value={x} checked={cuisine === x} onChange={() => setCuisine(x)} className="sr-only" />
                {f.cuisines[x]}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="label" id={id("formula")}>
            {f.formula} <span className="font-normal text-muted">({f.several})</span>
          </p>
          <div role="group" aria-labelledby={id("formula")} className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {FORMULAS.map((x) => (
              <label key={x} className="chip">
                <input type="checkbox" name="formula" value={x} checked={picked.includes(x)} onChange={() => setPicked((p) => (p.includes(x) ? p.filter((y) => y !== x) : [...p, x]))} className="sr-only" />
                {f.formulas[x]}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="label" id={id("service")}>
            {f.service}
          </p>
          <div role="radiogroup" aria-labelledby={id("service")} className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <label key={s} className="chip">
                <input type="radio" name="service" value={s} checked={service === s} onChange={() => setService(s)} className="sr-only" />
                {f.services[s]}
              </label>
            ))}
          </div>
        </div>
        <Field id={id("budget")} label={`${f.budget} (${f.optional})`}>
          <select id={id("budget")} value={budget} onChange={(e) => setBudget(e.target.value)} className="field">
            <option value="">{f.budgetNone}</option>
            {f.budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </Step>

      <Step n="3" title={d.quote.steps.contact}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
            <input id={id("name")} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
          </Field>
          <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
            <input id={id("phone")} type="tel" autoComplete="tel" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
          </Field>
        </div>
        <Field id={id("message")} label={`${f.message} (${f.optional})`}>
          <textarea id={id("message")} rows={3} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1200} />
        </Field>
      </Step>

      <div>
        <button type="submit" className="btn btn-primary w-full min-h-14 text-base sm:w-auto">
          <WhatsAppIcon className="h-5 w-5" />
          {d.quote.submit}
        </button>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{d.quote.hint}</p>
        <p className="text-[0.8125rem] leading-relaxed text-muted">{d.quote.consent}</p>
      </div>
    </form>
  );
}
