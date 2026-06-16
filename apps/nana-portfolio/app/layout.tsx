import { Geist_Mono, Noto_Serif, Raleway } from "next/font/google"

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
