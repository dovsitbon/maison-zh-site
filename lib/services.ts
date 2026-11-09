import type { FormulaId } from "@/lib/catalog";
import type { EventType } from "@/lib/quote";

export type ServiceId = "mariage" | "reception" | "entreprise" | "domicile";

/** Les 4 prestations : une page chacune (/fr/mariage, /fr/reception, /fr/entreprise, /fr/chef-a-domicile). */
export const SERVICES_PAGES: { id: ServiceId; slug: string; eventType: EventType; image: string; gallery: string[]; formulas: FormulaId[] }[] = [
  {
    id: "mariage",
    slug: "mariage",
    eventType: "mariage",
    image: "/media/mariages/buffet-mariage-parc.jpg",
    gallery: ["/media/mariages/table-dressee-chapiteau.jpg", "/media/europeen/pavlovas-service.jpg", "/media/animations/mechoui-service.jpg"],
    formulas: ["buffet", "servi", "mixte"],
  },
  {
    id: "reception",
    slug: "reception",
    eventType: "reception",
    image: "/media/mariages/buffet-fleurs-blanches.jpg",
    gallery: ["/media/animations/verrines-passion.jpg", "/media/animations/the-a-la-menthe.jpg", "/media/marocain/table-douceurs-dattes-bougies.jpg"],
    formulas: ["cocktail", "buffet", "marocain"],
  },
  {
    id: "entreprise",
    slug: "entreprise",
    eventType: "entreprise",
    image: "/media/corporate/plateau-cocktail-dinatoire.jpg",
    gallery: ["/media/corporate/bouchees-cocktail.jpg", "/media/animations/bar-a-mocktails.jpg", "/media/mariages/buffet-cocktail-terrasse.jpg"],
    formulas: ["cocktail", "buffet", "servi"],
  },
  {
    id: "domicile",
    slug: "chef-a-domicile",
    eventType: "domicile",
    image: "/media/galerie/table-chef-a-domicile.jpg",
    gallery: ["/media/europeen/agneau-puree-carotte.jpg", "/media/marocain/pastilla-poulet-amandes.jpg", "/media/europeen/pavlova-fruits-rouges.jpg"],
    formulas: ["domicile", "marocain", "mixte"],
  },
];

export const serviceBySlug = (slug: string) => SERVICES_PAGES.find((s) => s.slug === slug);
export const serviceById = (id: ServiceId) => SERVICES_PAGES.find((s) => s.id === id)!;
