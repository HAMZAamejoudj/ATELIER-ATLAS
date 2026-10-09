import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/locale";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale =
    value && isLocale(value) ? value : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
