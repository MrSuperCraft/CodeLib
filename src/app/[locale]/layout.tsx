import { ThemeProvider } from '@/components/ThemeProvider';
import React from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css";
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const figtree = Figtree({ subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode,
  params: { locale: string }

}>) {

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Providing the auth state
  const session = await auth();


  return (
    <html lang={locale} suppressHydrationWarning>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className={figtree.className}>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html >
  );
}
