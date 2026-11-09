import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["fr", "ar", "en"];

/** Français par défaut ; seule la langue choisie avec le sélecteur du site (cookie) l'emporte. */
function pickLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  return saved && LOCALES.includes(saved) ? saved : "fr";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|media|icon|apple-icon|og\\.jpg|logo|robots\\.txt|sitemap\\.xml|llms\\.txt|.*\\..*).*)"],
};
