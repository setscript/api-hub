"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex-1 flex justify-start">
          <div className="w-12"></div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SetScript Scraper</span>
          </Link>
        </div>
        
        <nav className="flex-1 flex items-center justify-center space-x-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/" ? "text-foreground font-bold" : "text-foreground/60"
            }`}
          >
            Ana Sayfa
          </Link>
          <Link
            href="/analytics"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/analytics" ? "text-foreground font-bold" : "text-foreground/60"
            }`}
          >
            Analitikler
          </Link>
        </nav>
        
        <div className="flex-1 flex items-center justify-end">
          <Link href="https://setscript.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              SetScript.com
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
} 