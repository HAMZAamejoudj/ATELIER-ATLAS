import { getTranslations } from "next-intl/server";

import { getContactSettings } from "@/actions/contact.actions";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { whatsappWaMeUrl } from "@/lib/whatsapp";

export async function WhatsAppFloatButton() {
  const t = await getTranslations("footer");
  const contact = await getContactSettings();
  const href = whatsappWaMeUrl(contact.whatsapp);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_22px_rgba(37,211,102,0.5)] transition-transform hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-8 sm:end-8"
      aria-label={t("social.whatsapp")}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
