/** Arc marocain au trait (arc brisé posé sur deux pieds droits), utilisé par la marque, l'ouverture et les décors. */
export const ARCH = "M18 96V50C18 27 32 11 50 4c18 7 32 23 32 46v46";

/** Marque seule (favicon, pied de page) : l'arc doré et « ZH » à l'intérieur. */
export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={ARCH} fill="none" stroke="var(--color-gold)" strokeWidth="2.4" strokeLinecap="round" />
      <text x="50" y="74" textAnchor="middle" fill="currentColor" fontFamily="var(--font-cormorant), Georgia, serif" fontSize="38" fontWeight="500" letterSpacing="1">
        ZH
      </text>
    </svg>
  );
}

/**
 * Logo typographique, redessiné d'après son logo Instagram : « MAISON » en capitales à empattements,
 * « Zh » en italique doré qui s'y accroche, « TRAITEUR » en petites capitales espacées dessous.
 * Remplaçable : public/logo.svg et app/icon.svg reprennent le même dessin.
 */
export function Logo({ className = "", compact = false, dark = false }: { className?: string; compact?: boolean; dark?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`} dir="ltr" translate="no">
      <span className="flex items-baseline">
        <span className={`font-[family-name:var(--font-cormorant)] font-medium tracking-[0.16em] ${compact ? "text-[1.45rem]" : "text-[1.7rem] md:text-[1.95rem]"}`}>MAISON</span>
        <span className={`-ms-1 font-[family-name:var(--font-cormorant)] font-medium italic ${dark ? "text-gold" : "text-gold-deep"} ${compact ? "text-[1.75rem]" : "text-[2.05rem] md:text-[2.35rem]"}`}>Zh</span>
      </span>
      <span className="mt-0.5 font-[family-name:var(--font-jost)] text-[0.5rem] font-medium tracking-[0.5em] opacity-75">TRAITEUR</span>
    </span>
  );
}
