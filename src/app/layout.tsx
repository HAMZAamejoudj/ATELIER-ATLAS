import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Noto_Sans_Arabic,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

import { getClientMessages } from "@/i18n/client-messages";

import { AuthProvider } from "@/app/providers";
import { AppProviders } from "@/components/cart/app-providers";
import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloatButton } from "@/components/layout/whatsapp-float-button";
import { StorefrontPopupWrapper } from "@/components/layout/storefront-popup-wrapper";
import { BRAND_NAME, SITE_LOGO_PATH } from "@/lib/constants";
import { getLocale } from "@/lib/get-locale";
import { localeDirection } from "@/lib/locale";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

function getSiteUrl(): URL {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;
  if (!envUrl) {
    return new URL("https://moroccantravertine.com");
  }
  const formatted =
    envUrl.startsWith("http://") || envUrl.startsWith("https://")
      ? envUrl
      : `https://${envUrl}`;
  try {
    return new URL(formatted);
  } catch {
    return new URL("https://moroccantravertine.com");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo");
  return {
    title: {
      default: t("home.title"),
      template: `%s | ${BRAND_NAME}`,
    },
    description: t("home.description"),
    metadataBase: getSiteUrl(),
    icons: {
      icon: SITE_LOGO_PATH,
      shortcut: SITE_LOGO_PATH,
      apple: SITE_LOGO_PATH,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const allMessages = await getMessages();
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const messages = getClientMessages(allMessages, pathname);

  return (
    <html
      lang={locale}
      dir={localeDirection(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${locale === "ar" ? notoArabic.variable : ""} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AppProviders>
              <SiteChrome
                footer={<SiteFooter />}
                popup={<StorefrontPopupWrapper />}
                floatingWhatsApp={<WhatsAppFloatButton />}
              >
                {children}
              </SiteChrome>
            </AppProviders>
          </AuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
