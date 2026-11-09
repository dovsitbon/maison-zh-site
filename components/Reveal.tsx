"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Apparition lente en fondu quand l'élément entre à l'écran (CSS + IntersectionObserver, sans bibliothèque).
 * `as="li"` pour rester valide dans une liste. Sans JavaScript ou avec prefers-reduced-motion, tout est visible.
 */
export function Reveal({ children, delay = 0, className = "", y = 24, as = "div" }: { children: ReactNode; delay?: number; className?: string; y?: number; as?: "div" | "li" }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  const style = { "--ry": `${y}px`, "--rd": `${delay}s` } as CSSProperties;
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
