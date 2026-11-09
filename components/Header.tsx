"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

/** En-tête collant : navigation, logo, langue, Instagram, téléphone et « Demander un devis » toujours visibles. */
export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const links = [
    { href: `${home}/mariage`, label: d.nav.mariages },
    { href: `${home}/reception`, label: d.nav.receptions },
    { href: `${home}/entreprise`, label: d.nav.entreprises },
    { href: `${home}/chef-a-domicile`, label: d.nav.domicile },
    { href: `${home}#realisations`, label: d.nav.realisations },
    { href: `${home}#devis`, label: d.nav.contact },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 border-b bg-ivory/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 ${scrolled ? "border-line shadow-[0_6px_24px_-18px_rgba(58,42,32,0.5)]" : "border-transparent"}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
          {d.nav.skip}
        </a>
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 md:h-20 md:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-6">
          <button type="button" className="-ms-2 flex h-11 w-11 items-center justify-center rounded-full xl:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
            <MenuIcon />
          </button>

          <nav className="hidden items-center gap-5 xl:order-1 xl:flex 2xl:gap-7" aria-label={d.nav.menu}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-[0.875rem] whitespace-nowrap transition-colors hover:text-gold-ink">
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href={home} title={d.nav.home} className="text-ink xl:order-2">
            <Logo compact />
          </Link>

          <div className="ms-auto flex items-center gap-2 md:gap-4 xl:order-3 xl:justify-self-end">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden md:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-2 2xl:flex" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={`tel:${site.tel}`} className="flex h-10 items-center gap-2 rounded-full px-2 transition-colors hover:bg-ivory-2 md:px-3" aria-label={d.nav.call}>
              <PhoneIcon />
              <span className="num hidden text-[0.9375rem] whitespace-nowrap 2xl:inline" dir="ltr">
                {site.phone}
              </span>
            </a>
            <Link href={`${home}#devis`} className="btn btn-primary hidden min-h-11 px-5 md:inline-flex">
              {d.nav.quote}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col overscroll-contain bg-ivory text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={d.nav.menu}
          >
            <div className="flex h-16 items-center gap-4 px-4">
              <button type="button" className="-ms-2 flex h-11 w-11 items-center justify-center rounded-full" onClick={() => setMenu(false)} aria-label={d.nav.close}>
                <CloseIcon />
              </button>
              <Logo compact />
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-6" aria-label={d.nav.menu}>
              {[...links.slice(0, 4), { href: `${home}/formules`, label: d.nav.formules }, ...links.slice(4)].map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i + 0.05, duration: 0.3 }}>
                  <Link href={l.href} onClick={() => setMenu(false)} className="display block py-1.5 text-[1.9rem]">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link href={`${home}#devis`} onClick={() => setMenu(false)} className="btn btn-primary mt-6 self-start">
                {d.nav.quote}
              </Link>
            </nav>
            <div className="flex items-center justify-between border-t border-line px-6 py-4">
              <LangSwitch lang={lang} label={d.nav.language} />
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm">
                <InstagramIcon />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
