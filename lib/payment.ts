import paiement from "@/data/paiement.json";

/**
 * Paiement en ligne de l'acompte : prévu mais désactivé par défaut (data/paiement.json → enabled: false).
 * Pour l'activer : créer un lien de paiement Stripe (Payment Link) pour l'acompte, le coller dans depositLink
 * et passer enabled à true. Le bouton « Payer l'acompte en ligne » apparaît alors après l'envoi du devis.
 */
export const depositUrl: string | null = paiement.enabled && paiement.depositLink ? paiement.depositLink : null;
