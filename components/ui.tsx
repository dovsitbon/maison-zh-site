import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { altOf, type Dict } from "@/lib/i18n";
import { img } from "@/lib/media";

/** Photo de public/media avec son texte alternatif dans la langue de la page. */
export function Photo({ d, src, sizes, className = "", fillBox = false, priority = false }: { d: Dict; src: string; sizes: string; className?: string; fillBox?: boolean; priority?: boolean }) {
  const m = img(src);
  return fillBox ? (
    <Image src={m.src} alt={altOf(d, src)} fill sizes={sizes} quality={70} priority={priority} className={`object-cover ${className}`} />
  ) : (
    <Image src={m.src} alt={altOf(d, src)} width={m.width} height={m.height} sizes={sizes} quality={70} priority={priority} className={`h-auto w-full ${className}`} />
  );
}

export function SectionHead({ eyebrow, title, text, id, center = false, as: H = "h2" }: { eyebrow: string; title: string; text?: string; id?: string; center?: boolean; as?: "h1" | "h2" }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <H id={id} className="display mt-3 text-[2.25rem] md:text-[3.25rem]">
        {title}
      </H>
      {text && <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{text}</p>}
    </Reveal>
  );
}
