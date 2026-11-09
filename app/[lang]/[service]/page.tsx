import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { FormulaCard } from "@/components/FormulaCard";
import { PrefillLink } from "@/components/FormulaCta";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/ui";
import { formulas } from "@/lib/catalog";
import { fill, getDict, isLocale, locales, type Locale } from "@/lib/i18n";
import { waLink } from "@/lib/quote";
import { jsonLd, pageMeta, serviceJsonLd } from "@/lib/seo";
import { SERVICES_PAGES, serviceBySlug } from "@/lib/services";

export function generateStaticParams() {
  return locales.flatMap((lang) => SERVICES_PAGES.map((s) => ({ lang, service: s.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/[service]">): Promise<Metadata> {
  const { lang, service } = await params;
  const s = serviceBySlug(service);
  if (!isLocale(lang) || !s) return {};
  const t = getDict(lang).services.items[s.id];
  return pageMeta(lang, `/${s.slug}`, t.metaTitle, t.metaDescription, s.image);
}

/** Page d'une prestation (mariage, réception, entreprise, chef à domicile). */
export default async function ServicePage({ params }: PageProps<"/[lang]/[service]">) {
  const { lang: l, service } = await params;
  const s = serviceBySlug(service);
  if (!s) notFound();
  const lang = l as Locale;
  const d = getDict(lang);
  const t = d.services.items[s.id];
  const others = SERVICES_PAGES.filter((x) => x.id !== s.id);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceJsonLd(lang, s.id))} />
      <section className="px-5 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-muted">
              <Link href={`/${lang}`} className="link-line">
                Maison ZH
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span aria-current="page">{t.eyebrow}</span>
            </nav>
            <p className="eyebrow mt-10">{t.eyebrow}</p>
            <h1 className="display mt-4 text-[2.8rem] md:text-[4rem] lg:text-[4.6rem]">{t.title}</h1>
            <div className="zellige mt-6 w-36 text-gold" aria-hidden="true" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrefillLink prefill={{ eventType: s.eventType }} label={d.nav.quote} className="btn btn-primary" />
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
            <p className="mt-6 text-[0.9375rem] text-muted">{fill(d.hero.proof, { n: site.followers })}</p>
          </div>
          <div className="arch relative aspect-[4/5] overflow-hidden bg-stone">
            <Photo d={d} src={s.image} fillBox priority sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="space-y-5 text-[1.0625rem] leading-relaxed text-muted">
            {t.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div>
            <h2 className="display text-[1.9rem]">{d.services.includesTitle}</h2>
            <ul className="mt-5 space-y-3">
              {t.includes.map((x) => (
                <li key={x} className="flex gap-3">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-ink" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="mx-auto mt-14 grid max-w-[1400px] grid-cols-3 gap-3 md:gap-6" aria-label={d.services.galleryTitle}>
          {s.gallery.map((g) => (
            <li key={g} className="zoom relative aspect-[3/4] overflow-hidden rounded-xl bg-stone">
              <Photo d={d} src={g} fillBox sizes="(min-width: 1400px) 450px, 32vw" />
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24" aria-labelledby="f-title">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="f-title" className="display text-[2.2rem] md:text-[3rem]">
            {d.services.formulasTitle}
          </h2>
          <ul className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {formulas
              .filter((f) => s.formulas.includes(f.id))
              .map((f, i) => (
                <Reveal as="li" key={f.id} delay={i * 0.05} y={16}>
                  <FormulaCard f={f} d={d} lang={lang} />
                </Reveal>
              ))}
          </ul>
          <div className="mt-16 border-t border-line pt-8">
            <p className="eyebrow">{d.services.back}</p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={`/${lang}/${o.slug}`} className="link-line display text-[1.4rem]">
                    {d.services.items[o.id].eyebrow}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
