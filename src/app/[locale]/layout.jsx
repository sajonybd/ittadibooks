

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Navbar from "../components/Navbar";
import DockSection from "../components/DockSection";
import AuthProvider from "@/lib/AuthProvider";
import { Toaster } from "react-hot-toast";
import enMessages from "@/messages/en.json";
import bnMessages from "@/messages/bn.json";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton/WhatsAppButton";
import PageWrapper from "../components/PageWrapper";

// Fonts
import localFont from "next/font/local";

const notoSerifBengali = localFont({
  src: "../../lib/NotoSerifBengali-VariableFont_wdth,wght.ttf",
  display: "swap",
  variable: "--font-noto-serif-bengali",
});

const localMessagesMap = {
  en: enMessages,
  bn: bnMessages,
};

export default async function LocaleLayout({ children, params: paramsPromise }) {
  // Await the params promise
  const params = await paramsPromise;
  if (!params || !params.locale) notFound();

  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = localMessagesMap[locale];
  if (!messages) notFound();

  return (
    <html lang={locale} data-theme="light">
      <body className={notoSerifBengali.className}>
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <PageWrapper>{children}</PageWrapper>
            <DockSection />
            <Footer />
            <WhatsAppButton />
          </NextIntlClientProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
