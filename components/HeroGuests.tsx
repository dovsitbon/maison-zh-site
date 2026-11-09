"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale } from "@/components/providers";

/** « Combien d'invités ? » : le chiffre est reporté dans le formulaire de devis, puis on y descend. */
export function HeroGuests() {
  const { d, setPrefill } = useLocale();
  const [guests, setGuests] = useState("");
  const id = useId();

  const go = (e: FormEvent) => {
    e.preventDefault();
    const n = guests.replace(/\D/g, "").slice(0, 4);
    setPrefill({ guests: n });
    document.getElementById("devis")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setTimeout(() => document.getElementById("q-date")?.focus({ preventScroll: true }), 600);
  };

  return (
    <form onSubmit={go} className="flex w-full max-w-md items-stretch gap-2 rounded-full bg-ivory p-1.5 text-ink shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] md:bg-white md:shadow-none md:ring-1 md:ring-line">
      <label htmlFor={id} className="sr-only">
        {d.hero.guestsLabel}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={5000}
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        placeholder={d.hero.guestsLabel}
        className="num min-w-0 flex-1 rounded-full bg-transparent ps-5 text-[1.0625rem] outline-none placeholder:font-[family-name:var(--font-jost)] placeholder:text-muted focus-visible:ring-2 focus-visible:ring-gold rtl:pe-5 rtl:ps-0"
      />
      <button type="submit" className="btn btn-primary shrink-0 px-5">
        <span className="sm:hidden">{d.nav.quoteShort}</span>
        <span className="hidden sm:inline">{d.hero.cta}</span>
      </button>
    </form>
  );
}
