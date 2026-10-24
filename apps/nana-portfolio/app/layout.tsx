import { Geist_Mono, Noto_Serif, Raleway } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif-heading",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Nana Addo | Frontend & AI Engineer",
  description:
    "Nana Addo Dankwa Bampoe Addo is a software developer in Passau, Germany, specialising in React, TypeScript, LLM applications and workflow automation. Explore selected projects, experience and role-specific CVs.",
  openGraph: {
    title: "Nana Addo | Frontend & AI Engineer",
    description:
      "Frontend engineering, LLM applications and workflow automation. Explore Nana Addo's selected projects and download a Frontend Engineer or AI Engineer CV.",
    images: [
      {
        url: "/images/profile/nana-portrait.png",
        width: 1200,
        height: 1500,
        alt: "Portrait of Nana Addo Dankwa Bampoe Addo",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        raleway.variable,
        notoSerifHeading.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
