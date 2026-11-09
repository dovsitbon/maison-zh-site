import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";
import { FormulaCard } from "@/components/FormulaCard";
import { PrefillLink } from "@/components/FormulaCta";
import { HeroGuests } from "@/components/HeroGuests";
import { ArrowIcon, ChatIcon, ClocheIcon, InstagramIcon, PhoneIcon, PotIcon, TwinArchIcon, WhatsAppIcon } from "@/components/icons";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { Photo, SectionHead } from "@/components/ui";
import { animations, dishes, formulas, realisations, reviews } from "@/lib/catalog";
import { fill, getDict, intlLocale, isLocale, type Locale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { waLink } from "@/lib/quote";
import { homeJsonLd, jsonLd, pageMeta } from "@/lib/seo";
import { serviceById } from "@/lib/services";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "", d.meta.title, d.meta.description);
}

const ENGAGEMENT_ICONS = { maison: PotIcon, cuisines: TwinArchIcon, service: ClocheIcon, devis: ChatIcon } as const;
const TILE_IMAGES = {
  mariage: "/media/mariages/table-dressee-chapiteau.jpg",
  reception: "/media/mariages/buffet-cocktail-terrasse.jpg",
  entreprise: "/media/corporate/plateau-cocktail-dinatoire.jpg",
  domicile: "/media/galerie/table-chef-a-domicile.jpg",
} as const;
const BLOCK_IMAGES = ["/media/marocain/tajines-faience-bleue.jpg", "/media/europeen/pavlovas-service.jpg", "/media/corporate/bouchees-cocktail.jpg"];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const hero = img("/media/hero/buffet-chateau-nappe-sauge.jpg");
  const monthFmt = new Intl.DateTimeFormat(intlLocale[lang], { month: "long", year: "numeric", timeZone: "UTC" });
  const proof = fill(d.hero.proof, { n: site.followers });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeJsonLd(lang))} />

      {/* ——— Hero : plein écran sur mobile, photo dans une grande arche sur ordinateur ——— */}
      <section className="relative flex min-h-[calc(100svh-9rem)] items-end overflow-hidden bg-green text-ivory md:min-h-[calc(100svh-5rem)] md:items-center md:bg-ivory md:text-ink" aria-labelledby="hero-title">
        <div className="absolute inset-0 md:inset-y-8 md:start-auto md:end-8 md:w-[44%] lg:end-[max(2rem,calc((100vw-1400px)/2+2rem))] lg:w-[40%] xl:w-[36%]">
          <div className="relative h-full w-full overflow-hidden md:arch">
            <Image src={hero.src} alt={d.hero.alt} fill priority quality={75} sizes="(min-width: 1280px) 36vw, (min-width: 768px) 44vw, 100vw" className="object-cover object-[50%_40%]" />
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute -inset-3 hidden h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] md:block" aria-hidden="true">
            <path d="M1 99.5V40C1 17 22 3 50 0.6 78 3 99 17 99 40v59.5" fill="none" stroke="var(--color-gold)" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,43,36,0.15)_0%,rgba(22,43,36,0.55)_35%,rgba(22,43,36,0.94)_68%)] md:hidden" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-16 pb-8 md:px-8 md:py-16">
          <div className="max-w-xl md:w-[52%] md:max-w-none lg:w-[54%] xl:w-[56%]">
            <p className="rise eyebrow !text-gold-soft md:!text-gold-ink">{d.hero.eyebrow}</p>
            <h1 id="hero-title" className="display mt-5 text-[3rem] leading-[0.98] sm:text-[3.8rem] md:text-[4.4rem] lg:text-[5.6rem] xl:text-[6.4rem] rtl:text-[2.7rem] rtl:leading-[1.35] md:rtl:text-[3.6rem] lg:rtl:text-[4.4rem]">
              {d.hero.title}
            </h1>
            <div className="zellige rise mt-6 w-40 text-gold" aria-hidden="true" style={{ animationDelay: "0.05s" }} />
            <p className="rise mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ivory/90 md:text-lg md:text-muted" style={{ animationDelay: "0.1s" }}>
              {d.hero.text}
            </p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-start xl:flex-row xl:items-center" style={{ animationDelay: "0.2s" }}>
              <HeroGuests />
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost on-dark self-start sm:self-auto md:hover:!bg-green md:hover:!text-ivory">
                <WhatsAppIcon className="h-5 w-5" />
                {d.hero.whatsapp}
              </a>
            </div>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="rise mt-7 inline-flex items-center gap-2.5 text-[0.9375rem] text-ivory/85 transition-colors hover:text-ivory md:text-muted md:hover:text-ink" style={{ animationDelay: "0.3s" }}>
              <InstagramIcon />
              {proof}
            </a>
          </div>
        </div>
      </section>

      {/* ——— Tuiles de prestations ——— */}
      <section id="prestations" className="px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28" aria-labelledby="presta-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.prestations.eyebrow} title={d.prestations.title} id="presta-title" />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {d.prestations.items.map((p, i) => {
              const s = serviceById(p.id as keyof typeof TILE_IMAGES);
              return (
                <Reveal as="li" key={p.id} delay={i * 0.05} y={14}>
                  <Link href={`/${lang}/${s.slug}`} className="group block">
                    <div className="zoom arch-sm relative aspect-[3/4] overflow-hidden bg-stone">
                      <Photo d={d} src={TILE_IMAGES[p.id as keyof typeof TILE_IMAGES]} fillBox sizes="(min-width: 1024px) 24vw, 48vw" />
                    </div>
                    <h3 className="display mt-5 flex items-center justify-between gap-3 text-[1.45rem] md:text-[1.75rem]">
                      {p.name}
                      <ArrowIcon className="h-4 w-4 shrink-0 text-gold-ink transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{p.text}</p>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Engagements ——— */}
      <section className="border-y border-line bg-ivory-2 px-5 md:px-8" aria-label={d.engagements.label}>
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-8 py-12 lg:grid-cols-4">
          {d.engagements.items.map((s) => {
            const Icon = ENGAGEMENT_ICONS[s.id as keyof typeof ENGAGEMENT_ICONS];
            return (
              <li key={s.id} className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <Icon className="h-8 w-8 shrink-0 text-gold-ink" />
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ——— Deux univers ——— */}
      <section id="univers" className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="univers-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.univers.eyebrow} title={d.univers.title} text={d.univers.text} id="univers-title" />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {(["europeen", "marocain"] as const).map((u, i) => {
              const t = d.univers[u];
              const list = dishes[u];
              const dark = u === "marocain";
              return (
                <Reveal key={u} delay={i * 0.08} className={`flex flex-col rounded-2xl p-6 sm:p-8 md:p-10 ${dark ? "bg-green text-ivory" : "bg-ivory-2"}`}>
                  <div className="grid gap-6 sm:grid-cols-[0.8fr_1fr] sm:items-end">
                    <div className="zoom arch relative aspect-[3/4] overflow-hidden bg-stone">
                      <Photo d={d} src={list[0].image} fillBox sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 90vw" />
                    </div>
                    <div>
                      <h3 className="display text-[2.2rem] md:text-[2.6rem]">{t.name}</h3>
                      <p className={`mt-3 leading-relaxed ${dark ? "text-ivory/80" : "text-muted"}`}>{t.text}</p>
                    </div>
                  </div>
                  <ul className={`mt-8 divide-y ${dark ? "divide-ivory/15 border-ivory/15" : "divide-line border-line"} border-y`}>
                    {list.slice(0, 4).map((x) => (
                      <li key={x.id} className="py-3.5">
                        <p className="display text-[1.3rem]">{d.univers.dishes[x.id].name}</p>
                        <p className={`mt-0.5 text-[0.9375rem] ${dark ? "text-ivory/75" : "text-muted"}`}>{d.univers.dishes[x.id].text}</p>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${lang}/formules#${u}`} className={`btn btn-ghost mt-8 self-start ${dark ? "on-dark" : ""}`}>
                    {t.cta}
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-6 text-[0.875rem] text-muted">{d.univers.toConfirm}</p>
        </div>
      </section>

      {/* ——— Formules ——— */}
      <section id="formules" className="bg-ivory-2 px-5 py-20 md:px-8 md:py-28" aria-labelledby="formules-title">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead eyebrow={d.formules.eyebrow} title={d.formules.title} text={d.formules.text} id="formules-title" />
            <Link href={`/${lang}/formules`} className="link-line shrink-0 self-start text-[0.9375rem] font-medium md:self-auto">
              {d.formules.seeAll}
            </Link>
          </div>
          <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {formulas.map((f, i) => (
              <Reveal as="li" key={f.id} delay={(i % 3) * 0.05} y={16}>
                <FormulaCard f={f} d={d} lang={lang} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Animations (« Show ») ——— */}
      <section id="animations" className="bg-green px-5 py-20 text-ivory md:px-8 md:py-28" aria-labelledby="anim-title">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="max-w-2xl">
            <p className="eyebrow !text-gold-soft">{d.animations.eyebrow}</p>
            <h2 id="anim-title" className="display mt-3 text-[2.25rem] md:text-[3.25rem]">
              {d.animations.title}
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ivory/80">{d.animations.text}</p>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {animations.map((a, i) => (
              <Reveal as="li" key={a.id} delay={i * 0.05} y={14}>
                <div className="zoom relative aspect-[3/4] overflow-hidden rounded-xl bg-green-deep">
                  <Photo d={d} src={a.image} fillBox sizes="(min-width: 1024px) 24vw, 48vw" />
                </div>
                <h3 className="display mt-4 text-[1.4rem] md:text-[1.6rem]">{d.animations.items[a.id].name}</h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ivory/75">{d.animations.items[a.id].text}</p>
              </Reveal>
            ))}
          </ul>
          <PrefillLink prefill={{ formula: "animations" }} label={d.animations.cta} className="btn btn-ghost on-dark mt-12" />
        </div>
      </section>

      {/* ——— Trois blocs alternés ——— */}
      <section className="space-y-20 px-5 py-20 md:space-y-28 md:px-8 md:py-28" aria-label={d.blocks[0].eyebrow}>
        {d.blocks.map((b, i) => {
          const href = [`/${lang}/formules`, `/${lang}#realisations`, `/${lang}#devis`][i];
          return (
            <div key={b.title} className="mx-auto grid max-w-[1200px] items-center gap-10 md:grid-cols-2 md:gap-20">
              <Reveal className={`zoom arch relative aspect-[4/5] overflow-hidden bg-stone ${i % 2 ? "md:order-2" : ""}`}>
                <Photo d={d} src={BLOCK_IMAGES[i]} fillBox sizes="(min-width: 768px) 44vw, 100vw" />
              </Reveal>
              <Reveal className="max-w-lg" delay={0.08}>
                <p className="eyebrow">{b.eyebrow}</p>
                <h2 className="display mt-3 text-[2.2rem] md:text-[3rem]">{b.title}</h2>
                <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{b.text}</p>
                {i === 2 ? (
                  <PrefillLink prefill={{ eventType: "entreprise" }} label={b.cta} className="btn btn-primary mt-8" />
                ) : (
                  <Link href={href} className="btn btn-ghost mt-8">
                    {b.cta}
                  </Link>
                )}
              </Reveal>
            </div>
          );
        })}
      </section>

      {/* ——— Réalisations ——— */}
      <section id="realisations" className="bg-ivory-2 px-5 py-20 md:px-8 md:py-28" aria-labelledby="real-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.realisations.eyebrow} title={d.realisations.title} text={d.realisations.text} id="real-title" />
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {realisations.map((r, i) => {
              const t = d.realisations.items[r.id];
              const [y, m] = r.date.split("-").map(Number);
              return (
                <Reveal as="li" key={r.id} delay={(i % 3) * 0.05} y={16}>
                  <article>
                    <a href={r.instagram} target="_blank" rel="noopener noreferrer" className="zoom relative block aspect-[4/5] overflow-hidden rounded-xl bg-stone" aria-label={`${t.title} · ${d.realisations.see}`}>
                      <Photo d={d} src={r.image} fillBox sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" />
                      <span className="absolute start-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[0.8125rem] font-medium">{d.realisations.types[r.type]}</span>
                    </a>
                    <h3 className="display mt-5 text-[1.6rem]">{t.title}</h3>
                    <p className="mt-1 flex flex-wrap gap-x-3 text-[0.9375rem] text-gold-ink">
                      {r.venue && <span>{r.venue}</span>}
                      <span className="first-letter:uppercase">{monthFmt.format(new Date(Date.UTC(y, m - 1, 1)))}</span>
                      {r.guests && <span>{fill(d.realisations.guests, { n: r.guests })}</span>}
                    </p>
                    <p className="mt-2 leading-relaxed text-muted">{t.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-line mt-12 inline-flex items-center gap-2 text-[0.9375rem] font-medium">
            <InstagramIcon />
            {d.realisations.more}
          </a>
        </div>
      </section>

      {/* ——— Comment ça marche ——— */}
      <section id="comment" className="px-5 py-20 md:px-8 md:py-28" aria-labelledby="how-title">
        <div className="mx-auto max-w-[1400px]">
          <SectionHead eyebrow={d.how.eyebrow} title={d.how.title} id="how-title" />
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {d.how.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06} y={12} className="border-t border-gold/60 pt-6">
                <span className="num text-[2.6rem] leading-none text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-4 text-[1.6rem]">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Avis ——— */}
      <section id="avis" className="px-5 pb-20 md:px-8 md:pb-28" aria-labelledby="reviews-title">
        <div className="mx-auto max-w-[1400px] rounded-2xl bg-ivory-2 px-6 py-14 md:px-14 md:py-20">
          <p className="eyebrow">{d.reviews.eyebrow}</p>
          <h2 id="reviews-title" className="display mt-3 text-[2.25rem] md:text-[3rem]">
            {d.reviews.title}
          </h2>
          {/* À REMPLIR avec de vrais avis clients (story « AVIS ») : data/avis.json. Aucun avis inventé. */}
          {reviews.length ? (
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.author + r.text.slice(0, 12)} className="rounded-xl bg-ivory p-6">
                  <blockquote className="display text-[1.3rem] leading-snug" lang={r.lang}>
                    « {r.text} »
                  </blockquote>
                  <p className="mt-4 text-sm text-muted">
                    {r.author}
                    {r.event ? ` · ${r.event}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-[1.0625rem] leading-relaxed text-muted">{d.reviews.empty}</p>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost shrink-0 self-start">
                <InstagramIcon />
                {d.reviews.cta}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ——— Zone desservie + FAQ ——— */}
      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div aria-labelledby="zone-title">
            <SectionHead eyebrow={d.zone.eyebrow} title={d.zone.title} text={d.zone.text} id="zone-title" />
            {/* Départements : à confirmer avec Maison ZH (data/site.json → departments.confirmed) */}
            <p className="mt-8 text-sm font-medium text-gold-ink">{d.zone.departments}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.departments.map((x) => (
                <li key={x.code} className="rounded-full border border-line px-4 py-2 text-[0.9375rem]">
                  <span className="num me-1.5">{x.code}</span>
                  {x.name}
                </li>
              ))}
            </ul>
          </div>
          <div id="faq" aria-labelledby="faq-title">
            <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} id="faq-title" />
            <div className="mt-8 divide-y divide-line border-y border-line">
              {d.faq.items.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-medium">
                    {f.q}
                    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-lg transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Demande de devis ——— */}
      <section id="devis" className="scroll-mt-16 bg-stone px-5 py-20 md:px-8 md:py-28" aria-labelledby="quote-title">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16 [&>*]:min-w-0">
          <div>
            <SectionHead eyebrow={d.quote.eyebrow} title={d.quote.title} text={d.quote.text} id="quote-title" />
            <div className="mt-8 space-y-3">
              <a href={`tel:${site.tel}`} className="flex min-h-11 items-center gap-3 text-lg">
                <PhoneIcon className="h-5 w-5 text-terra" />
                <span className="num text-xl" dir="ltr">
                  {site.phone}
                </span>
              </a>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 text-lg">
                <WhatsAppIcon className="h-5 w-5 text-terra" />
                WhatsApp
              </a>
            </div>
            {/* Preuves près du bouton */}
            <ul className="mt-10 space-y-5 border-t border-ink/15 pt-8">
              {d.stats.items.map((s) => (
                <li key={s.value} className="flex items-baseline gap-4">
                  <span className="num w-24 shrink-0 text-[2.2rem] leading-none text-terra-deep" dir="ltr">{s.value}</span>
                  <span className="leading-relaxed text-muted">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
