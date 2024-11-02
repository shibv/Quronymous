import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import "./globals.css"
import Head from "next/head"


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

// Next.js assumes "export const metadata" will be used in a layout or page component
export const metadata = {
  title: "Quronymous - Anonymous Messaging for Friends",
  description: "Send and receive anonymous messages with your friends in a secure platform.",
  openGraph: {
    title: "Quronymous - Anonymous Messaging for Friends",
    description: "Connect with friends anonymously by sending and receiving secret messages.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/link.png`, // Using full URL
        width: 1000,
        height: 800,
        alt: "Quronymous - Anonymous Messaging for Friends",
      },
    ],
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
     
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen" style={{
  background: "linear-gradient(90deg, #fffbea, #ffe3f9)"
}}
 >
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
