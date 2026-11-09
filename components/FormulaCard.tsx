import { PrefillLink } from "@/components/FormulaCta";
import { CheckIcon } from "@/components/icons";
import { Photo } from "@/components/ui";
import { euros, type Formula } from "@/lib/catalog";
import { fill, intlLocale, type Dict, type Locale } from "@/lib/i18n";

const PREFILL: Record<Formula["id"], Parameters<typeof PrefillLink>[0]["prefill"]> = {
  cocktail: { formula: "cocktail" },
  buffet: { formula: "buffet" },
  servi: { formula: "servi" },
  marocain: { cuisine: "marocaine" },
  mixte: { cuisine: "mixte" },
  domicile: { eventType: "domicile" },
};

/** Carte de formule : photo, ce qui est inclus, prix « à partir de » par personne, minimum d'invités. */
export function FormulaCard({ f, d, lang, headingLevel = "h3" }: { f: Formula; d: Dict; lang: Locale; headingLevel?: "h2" | "h3" }) {
  const t = d.formules.items[f.id];
  const H = headingLevel;
  return (
    <article id={f.id} className="flex h-full scroll-mt-28 flex-col">
      <div className="zoom arch-sm relative aspect-[4/5] overflow-hidden bg-stone">
        <Photo d={d} src={f.image} fillBox sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col pt-6">
        <H className="display text-[1.85rem]">{t.name}</H>
        <p className="mt-2 leading-relaxed text-muted">{t.text}</p>
        <ul className="mt-4 space-y-1.5 text-[0.9375rem]">
          {t.includes.map((x) => (
            <li key={x} className="flex gap-2">
              <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-ink" />
              {x}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
            <p>
              {f.priceFrom ? (
                <>
                  <span className="block text-[0.8125rem] text-muted">{d.formules.from}</span>
                  <span className="num text-[1.9rem] leading-none">{euros(f.priceFrom, intlLocale[lang])}</span> <span className="text-sm text-muted">{d.formules.perPerson}</span>
                </>
              ) : (
                <span className="num text-[1.45rem] leading-none">{d.formules.onQuote}</span>
              )}
            </p>
            <p className="text-end text-[0.8125rem] text-muted">{f.minGuests ? fill(f.id === "domicile" ? d.formules.minPeople : d.formules.minGuests, { n: f.minGuests }) : d.formules.minGuestsTbc}</p>
          </div>
          <PrefillLink prefill={PREFILL[f.id]} label={d.formules.choose} className="btn btn-ghost mt-5 w-full" />
        </div>
      </div>
    </article>
  );
}
