"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

type Prefill = Parameters<ReturnType<typeof useLocale>["setPrefill"]>[0];

/** Bouton qui pré-remplit le devis (formule, cuisine ou type d'événement), puis y descend. */
export function PrefillLink({ prefill, label, className = "btn btn-ghost" }: { prefill: Prefill; label: string; className?: string }) {
  const { lang, setPrefill } = useLocale();
  return (
    <Link href={`/${lang}#devis`} onClick={() => setPrefill(prefill)} className={className}>
      {label}
    </Link>
  );
}
