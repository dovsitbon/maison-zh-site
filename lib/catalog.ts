import formulesData from "@/data/formules.json";
import menusData from "@/data/menus.json";
import animationsData from "@/data/animations.json";
import realisationsData from "@/data/realisations.json";
import avisData from "@/data/avis.json";
import annoncesData from "@/data/annonces.json";
import type { Locale } from "@/lib/i18n";

export type FormulaId = "cocktail" | "buffet" | "servi" | "marocain" | "mixte" | "domicile";
export type Formula = { id: FormulaId; priceFrom: number | null; minGuests: number | null; image: string };
export const formulas = formulesData.formules as Formula[];

export type DishId = "tartare" | "agneau" | "roti" | "volaille" | "pavlova" | "dome" | "pastillaPoulet" | "pastillaMer" | "tajinePruneaux" | "pouletCitron" | "mechoui" | "douceurs";
export type Dish = { id: DishId; confirmed: boolean; image: string };
export const dishes = menusData as { europeen: Dish[]; marocain: Dish[] };

export type AnimationId = "mocktails" | "the" | "mechoui" | "fruits";
export const animations = animationsData.animations as { id: AnimationId; confirmed: boolean; priceFrom: number | null; image: string }[];

export type RealType = "mariage" | "reception" | "domicile" | "entreprise";
export type RealId = "halah" | "yanis" | "zayn" | "chapiteau" | "grandmorin" | "lina";
export const realisations = realisationsData.realisations as { id: RealId; type: RealType; venue: string | null; date: string; guests: number | null; image: string; instagram: string }[];

export type Review = { author: string; event?: string; date?: string; text: string; lang?: string };
export const reviews = avisData.avis as Review[];

type Annonce = { id: string; active: boolean; from: string; to: string; text: Record<Locale, string> };
/** Annonce du jour (heure de Paris), ou null. */
export function currentAnnonce(today: string) {
  return (annoncesData.annonces as Annonce[]).find((a) => a.active && a.from <= today && today <= a.to) ?? null;
}

export const euros = (n: number, intl: string) => new Intl.NumberFormat(intl, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
