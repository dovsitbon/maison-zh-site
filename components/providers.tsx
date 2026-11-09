"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import type { Cuisine, QuoteFormula } from "@/lib/quote";

type Ctx = {
  lang: Locale;
  d: Dict;
  /** Pré-remplissage du devis depuis le hero (invités) ou une carte de formule. */
  prefill: { guests: string; formula: QuoteFormula | ""; eventType: string; cuisine: Cuisine | "" };
  setPrefill: (p: Partial<Ctx["prefill"]>) => void;
};
const LocaleContext = createContext<Ctx | null>(null);

export function useLocale() {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("useLocale hors de Providers");
  return v;
}

export function Providers({ lang, d, children }: { lang: Locale; d: Dict; children: ReactNode }) {
  const [prefill, set] = useState<Ctx["prefill"]>({ guests: "", formula: "", eventType: "", cuisine: "" });
  const value = useMemo(() => ({ lang, d, prefill, setPrefill: (p: Partial<Ctx["prefill"]>) => set((o) => ({ ...o, ...p })) }), [lang, d, prefill]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
