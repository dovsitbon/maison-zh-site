# Infos à demander à Maison ZH

Ce qui est déjà sur le site vient de son profil Instagram public (bio, 11 reels et leurs légendes). Les stories à la une (AVIS, MENU, CORPORATE, MAROCAIN, SHOW, INFOS) ne sont pas lisibles sans connexion : tout ce qu'elles contiennent reste à récupérer.

1. **Son prénom et son histoire** : qui est derrière Maison ZH, depuis quand, son parcours en cuisine. Une section « Le chef » pourra être ajoutée.
2. **Les menus européens et marocains** (stories « MENU » et « MAROCAIN ») → `data/menus.json` et `locales/*.json` (`univers.dishes`). Les 12 plats affichés viennent de ses photos ; 3 seulement sont cités dans une légende (pastilla au poulet, rôti, pavlova).
3. **Les formules et les prix par personne** → `data/formules.json` (`priceFrom`). Tant que c'est vide, le site affiche « Sur devis ».
4. **Le minimum d'invités** par formule → `data/formules.json` (`minGuests`). Seul fait connu : chef à domicile dès 4 personnes (légende du 25/09/2024).
5. **Les animations et leurs prix** (story « SHOW ») → `data/animations.json`. Affichées : bar à mocktails (cité en légende), thé à la menthe, méchoui en salle, plateaux de fruits (vus en photo). Cuisine en direct, découpe, stand pastilla : à confirmer.
6. **L'offre entreprise** (story « CORPORATE ») : formules, minimum, références clients. Aucune photo d'événement d'entreprise n'est publique ; la page Entreprise utilise des photos de cocktail.
7. **Le chef à domicile** : formule, prix, nombre de couverts maximum.
8. **Les départements desservis et les frais de déplacement** → `data/site.json` (`departments`, `confirmed`). Le site affiche les 8 départements d'Île-de-France « à confirmer ».
9. **Le service et l'installation sur place** : personnel, vaisselle, nappage, prix.
10. **Halal ou non, et la provenance de la viande.** La FAQ ne s'engage pas tant que ce n'est pas confirmé.
11. **La dégustation** : oui ou non, prix, déduite du devis ?
12. **L'acompte** : pourcentage et moyen de paiement. Le paiement en ligne est prévu mais désactivé (`data/paiement.json`).
13. **De vrais avis clients** (story « AVIS » + nouveaux), avec accord de publication → `data/avis.json`.
14. **Le nombre d'invités** de chaque réalisation et le nom des lieux (Halah & Achraf, Yanis & Myriam, Zayn, réception sous chapiteau, Grand Morin, Lina & Hamza) → `data/realisations.json`.
15. **Des photos et vidéos en bonne qualité** (fichiers originaux). Les images du site sont extraites de ses reels (720 × 1280) : une grande photo horizontale de buffet ou de table dressée pour le haut de page serait idéale. À déposer dans `assets/a-venir/`.
16. **Le logo** s'il existe en fichier (le site utilise une version redessinée d'après sa photo de profil : `public/logo.svg`, `app/icon.svg`).
17. **Son e-mail**, sa forme juridique, son SIRET et son adresse pour les mentions légales.
