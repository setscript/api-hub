import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./components/Navbar"));

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SetScript.com Scraper & Analitik",
  description: "SetScript.com adresinden veri çekmek ve analiz etmek için bir web uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth dark">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} SetScript.com Scraper & Analitik. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://setscript.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  SetScript.com
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
