import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/quote";

/** Bureau : bulle WhatsApp (sur mobile, la barre du bas la remplace). */
export function WhatsAppFloat({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed end-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-green text-ivory shadow-[0_10px_30px_-10px_rgba(58,42,32,0.6)] transition-colors hover:bg-green-deep md:flex"
    >
      <WhatsAppIcon />
    </a>
  );
}
