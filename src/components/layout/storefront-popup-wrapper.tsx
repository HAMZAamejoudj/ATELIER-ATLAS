import { getPopupConfig } from "@/actions/popup.actions";
import { getLocale } from "@/lib/get-locale";
import { PromotionalPopup } from "@/components/popup/PromotionalPopup";

export async function StorefrontPopupWrapper() {
  const [config, locale] = await Promise.all([
    getPopupConfig(),
    getLocale(),
  ]);

  if (!config.enabled) return null;

  return <PromotionalPopup config={config} locale={locale} />;
}
