import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import "./globals.css"
import Head from "next/head"
import img from "../public/link.png"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata = {
  title: "Quronymous - Anonymous Messaging for Quora Users",
  description: "Send and receive anonymous messages in a Quora-inspired platform",
  image: `${img}`,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Quronymous - Anonymous Messaging for Quora Users" />
        <meta property="og:description" content="Send and receive anonymous messages in a Quora-inspired platform" />
        <meta property="og:image" content={img} />
        <meta property="og:url" content="https://quronymous.165131.xyz/" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quronymous - Anonymous Messaging for Quora Users" />
        <meta name="twitter:description" content="Send and receive anonymous messages in a Quora-inspired platform" />
        <meta name="twitter:image" content={img} />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Quronymous. All rights reserved.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
