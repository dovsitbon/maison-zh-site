"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { currentAnnonce } from "@/lib/catalog";
import { isoDay } from "@/lib/quote";

const KEY = "maisonzh-annonce-fermee";

/** Bandeau d'infos pratiques (data/annonces.json), refermable ; le choix est retenu sur l'appareil. */
export function Announcement() {
  const { lang, d } = useLocale();
  const [annonce, setAnnonce] = useState<ReturnType<typeof currentAnnonce>>(null);

  useEffect(() => {
    const a = currentAnnonce(isoDay(new Date()));
    let closed = false;
    try {
      closed = localStorage.getItem(KEY) === a?.id;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue côté client
    if (a && !closed) setAnnonce(a);
  }, []);

  if (!annonce) return null;

  return (
    <div className="relative z-[51] bg-green text-ivory">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2 md:px-8">
        <p className="flex-1 text-center text-[0.8125rem] leading-snug md:text-sm">{annonce.text[lang]}</p>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(KEY, annonce.id);
            } catch {}
            setAnnonce(null);
          }}
          className="-me-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ivory/15"
          aria-label={d.announce.close}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
