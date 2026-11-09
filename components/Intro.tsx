"use client";

import { useEffect, useState, type CSSProperties } from "react";

const KEY = "maisonzh-intro";
const at = (d: number, t?: number) => ({ "--d": `${d}s`, ...(t !== undefined ? { "--t": `${t}s` } : {}) }) as CSSProperties;

/**
 * Ouverture (1,5 s, une fois par session) sur fond ivoire : un arc marocain se dessine au trait doré,
 * « MAISON » apparaît dans l'arc, puis « ZH » ; une fine ligne de zellige se trace sous le nom ; fondu sur le hero.
 * Tout est en CSS (globals.css) : l'animation part dès le premier rendu, sans attendre l'hydratation.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  const done = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    document.documentElement.classList.add("intro-seen");
  };

  useEffect(() => {
    const t = setTimeout(done, 1500);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro-curtain flex items-center justify-center text-ink">
      <svg viewBox="0 0 200 250" className="w-[min(54vw,230px)]" aria-hidden="true">
        {/* L'arc : pieds droits et arc brisé, puis un second filet intérieur plus fin */}
        <path className="intro-draw" style={at(0, 0.55)} pathLength={1} d="M30 220V108C30 62 58 30 100 14c42 16 70 48 70 94v112" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />
        <path className="intro-draw" style={at(0.15, 0.5)} pathLength={1} d="M42 220V110C42 72 66 44 100 30c34 14 58 42 58 80v110" fill="none" stroke="var(--color-gold)" strokeWidth="0.7" strokeLinecap="round" opacity="0.7" />
        {/* MAISON puis ZH */}
        <text className="intro-fade" style={at(0.5)} x="100" y="122" textAnchor="middle" fill="currentColor" fontFamily="var(--font-cormorant), Georgia, serif" fontSize="19" fontWeight="500" letterSpacing="6">
          MAISON
        </text>
        <text className="intro-fade" style={at(0.7)} x="100" y="176" textAnchor="middle" fill="var(--color-green)" fontFamily="var(--font-cormorant), Georgia, serif" fontSize="54" fontWeight="500" fontStyle="italic">
          Zh
        </text>
        {/* Ligne de zellige sous le nom */}
        <g className="intro-wipe" style={at(0.9)} fill="none" stroke="var(--color-gold)" strokeWidth="0.9">
          {[58, 79, 100, 121, 142].map((x) => (
            <path key={x} d={`M${x} 191l3.5 3.5-3.5 3.5-3.5-3.5Z`} />
          ))}
          <path d="M40 194.5h14.5M62 194.5h13.5M83 194.5h13.5M104 194.5h13.5M125 194.5h13.5M146 194.5h14" />
        </g>
      </svg>
      <button
        type="button"
        onClick={() => {
          done();
          setGone(true);
        }}
        className="absolute end-4 bottom-4 min-h-11 rounded-full px-4 text-sm text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </div>
  );
}
