import Link from "next/link";
import site from "@/data/site.json";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import type { Dict, Locale } from "@/lib/i18n";
import { waLink } from "@/lib/quote";
import { SERVICES_PAGES } from "@/lib/services";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <footer className="bg-green-deep text-ivory">
      <div className="zellige text-gold/50" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <Logo className="text-ivory" />
          <p className="mt-6 max-w-xs leading-relaxed text-ivory/75">{d.footer.tagline}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gold">{d.footer.pages}</h2>
          <ul className="mt-4 space-y-1">
            {SERVICES_PAGES.map((x) => (
              <li key={x.id}>
                <Link href={`/${lang}/${x.slug}`} className="inline-flex min-h-10 items-center hover:text-gold">
                  {d.services.items[x.id].eyebrow}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${lang}/formules`} className="inline-flex min-h-10 items-center hover:text-gold">
                {d.nav.formules}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gold">{d.footer.contact}</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`tel:${site.tel}`} className="inline-flex min-h-10 items-center gap-2.5 hover:text-gold">
                <PhoneIcon />
                <span className="num" dir="ltr">
                  {site.phone}
                </span>
              </a>
            </li>
            <li>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2.5 hover:text-gold">
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gold">{d.footer.zone}</h2>
          <p className="mt-4 leading-relaxed text-ivory/75">{d.footer.zoneText}</p>
          <p className="num mt-1 text-ivory/60" dir="ltr">
            {site.departments.map((x) => x.code).join(" · ")}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gold">{d.footer.follow}</h2>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2.5 hover:text-gold">
            <InstagramIcon />
            <span dir="ltr">{site.instagramHandle}</span>
          </a>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-6 text-[0.8125rem] text-ivory/60 sm:flex-row sm:justify-between md:px-8 md:pe-28">
          <p>
            © {new Date().getFullYear()} {site.name}. {d.footer.rights}
          </p>
          <Link href={`/${lang}/mentions-legales`} className="hover:text-ivory">
            {d.footer.legal}
          </Link>
        </div>
      </div>
    </footer>
  );
}
