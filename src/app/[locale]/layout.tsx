import { ThemeProvider } from '@/components/ThemeProvider';
import React from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css";
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SpeedInsights } from "@vercel/speed-insights/next"


const figtree = Figtree({ subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "CodeLib - A Snippet Manager for Developers",
  description: "CodeLib is a powerful tool for managing and organizing your code snippets with ease. Save, organize, and access your snippets anytime, anywhere.",
  keywords: ["CodeLib", "Snippet Manager", "Code Snippets", "Developer Tools", "Programming", "Coding"],
  authors: [{ name: "Itamar Hanan", url: "https://itamar-hanan.web.app" }],
  openGraph: {
    title: "CodeLib - The Ultimate Snippet Manager",
    description: "CodeLib helps developers organize and manage their code snippets efficiently.",
    url: "https://codelib-mrsupercraft.vercel.app",
    images: [
      {
        url: "https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png",
        alt: "CodeLib Snippet Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeLib - Manage Your Snippets Effectively",
    description: "The perfect solution for developers to manage their code snippets.",
    images: [
      {
        url: "https://codelib-mrsupercraft.vercel.app/codelib-opengraph.png",
        alt: "CodeLib Snippet Manager",
      },
    ],
    creator: "@ItamarHanan"
  },
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
      <SpeedInsights />
    </html >
  );
}
