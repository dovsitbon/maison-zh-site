import type { Metadata } from "next";
import Link from "next/link";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return pageMeta(lang, "/mentions-legales", d.meta.legalTitle, d.meta.legalDescription);
}

// À REMPLIR quand Maison ZH les fournit : forme juridique, SIRET, adresse, responsable de la publication.
export default async function Legal({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  const d = getDict(lang as Locale);
  return (
    <article className="mx-auto max-w-3xl px-5 pt-16 pb-24 md:pt-24 md:pb-32">
      <h1 className="display text-[2.6rem] md:text-[3.4rem]">{d.legal.title}</h1>
      <div className="rim mt-6 w-32 text-gold" aria-hidden="true" />
      <div className="mt-10 space-y-8">
        {d.legal.sections.map((s) => (
          <section key={s.title}>
            <h2 className="eyebrow">{s.title}</h2>
            <p className="mt-2 text-[1.0625rem] leading-relaxed text-muted">{s.text}</p>
          </section>
        ))}
      </div>
      <Link href={`/${lang}`} className="btn btn-ghost mt-12">
        {d.legal.back}
      </Link>
    </article>
  );
}
