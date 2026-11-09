import Link from "next/link";
import site from "@/data/site.json";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/quote";

/** Mobile : « Demander un devis » fixé en bas de l'écran, avec appel et WhatsApp. */
export function MobileBar({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-2">
        <a href={`tel:${site.tel}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line" aria-label={d.nav.call}>
          <PhoneIcon />
        </a>
        <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line" aria-label={d.whatsapp.float}>
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <Link href={`/${lang}#devis`} className="btn btn-primary flex-1">
          {d.mobileBar.quote}
        </Link>
      </div>
    </div>
  );
}
