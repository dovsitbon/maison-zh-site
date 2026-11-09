"use client";

import Link from "next/link";
import { Mark } from "@/components/Logo";
import { useLocale } from "@/components/providers";

export default function NotFound() {
  const { lang, d } = useLocale();
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-20 text-center">
      <Mark className="h-20 w-20 text-terra" />
      <p className="num mt-6 text-sm text-green">404</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{d.notFound.title}</h1>
      <p className="mt-4 max-w-md text-muted">{d.notFound.text}</p>
      <Link href={`/${lang}`} className="btn btn-primary mt-8">
        {d.notFound.back}
      </Link>
    </div>
  );
}
