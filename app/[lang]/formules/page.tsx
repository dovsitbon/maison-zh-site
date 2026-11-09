import type { Metadata } from "next";
import Link from "next/link";
import { FormulaCard } from "@/components/FormulaCard";
import { PrefillLink } from "@/components/FormulaCta";
import { Reveal } from "@/components/Reveal";
import { Photo, SectionHead } from "@/components/ui";
import { animations, dishes, formulas } from "@/lib/catalog";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { formulesJsonLd, jsonLd, pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/formules">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "/formules", d.meta.formulesTitle, d.meta.formulesDescription);
}

/** Formules, prix « à partir de » et plats signature des deux univers, en vraie page HTML indexable. */
export default async function Formules({ params }: PageProps<"/[lang]/formules">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(formulesJsonLd(lang))} />
      <section className="px-5 pt-12 pb-20 md:px-8 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href={`/${lang}`} className="link-line">
              Maison ZH
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{d.formules.pageEyebrow}</span>
          </nav>
          <div className="mt-8">
            <SectionHead as="h1" eyebrow={d.formules.pageEyebrow} title={d.formules.pageTitle} text={d.formules.pageIntro} />
          </div>
          <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {formulas.map((f, i) => (
              <Reveal as="li" key={f.id} delay={(i % 3) * 0.05} y={16}>
                <FormulaCard f={f} d={d} lang={lang} headingLevel="h2" />
              </Reveal>
            ))}
          </ul>
          <p className="mt-12 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{d.formules.pageNote}</p>
        </div>
      </section>

      {/* Plats signature, par univers */}
      <section className="bg-ivory-2 px-5 py-20 md:px-8 md:py-28" aria-labelledby="menus-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.univers.eyebrow} title={d.formules.menusTitle} text={d.formules.menusText} id="menus-title" />
          {(["europeen", "marocain"] as const).map((u) => (
            <div key={u} id={u} className="mt-16 scroll-mt-28">
              <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 md:flex-row md:items-end">
                <div>
                  <h2 className="display text-[2.2rem] md:text-[2.8rem]">{d.univers[u].name}</h2>
                  <p className="mt-2 max-w-xl leading-relaxed text-muted">{d.univers[u].text}</p>
                </div>
                <PrefillLink prefill={{ cuisine: u === "europeen" ? "europeenne" : "marocaine" }} label={d.formules.choose} className="btn btn-ghost shrink-0 self-start md:self-auto" />
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-5">
                {dishes[u].map((x, i) => (
                  <Reveal as="li" key={x.id} delay={(i % 6) * 0.04} y={12}>
                    <div className="zoom arch-sm relative aspect-[3/4] overflow-hidden bg-stone">
                      <Photo d={d} src={x.image} fillBox sizes="(min-width: 1024px) 15vw, (min-width: 768px) 30vw, 48vw" />
                    </div>
                    <h3 className="display mt-4 text-[1.25rem] leading-tight">{d.univers.dishes[x.id].name}</h3>
                    <p className="mt-1 text-[0.875rem] leading-relaxed text-muted">{d.univers.dishes[x.id].text}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-10 text-[0.875rem] text-muted">{d.univers.toConfirm}</p>
        </div>
      </section>

      {/* Animations */}
      <section id="animations" className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="anim-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.animations.eyebrow} title={d.animations.title} text={d.animations.text} id="anim-title" />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {animations.map((a) => (
              <li key={a.id}>
                <div className="zoom relative aspect-[3/4] overflow-hidden rounded-xl bg-stone">
                  <Photo d={d} src={a.image} fillBox sizes="(min-width: 1024px) 24vw, 48vw" />
                </div>
                <h3 className="display mt-4 text-[1.4rem]">{d.animations.items[a.id].name}</h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{d.animations.items[a.id].text}</p>
                <p className="num mt-2 text-[1.1rem]">{d.animations.onQuote}</p>
              </li>
            ))}
          </ul>
          <Link href={`/${lang}#devis`} className="btn btn-primary mt-14">
            {d.nav.quote}
          </Link>
        </div>
      </section>
    </>
  );
}
