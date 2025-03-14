"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [count, setCount] = useState(10);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="space-y-6 max-w-3xl">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold tracking-tight">Sayfa Bulunamadı</h2>
          <p className="text-muted-foreground text-xl">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>
        
        <div className="h-[1px] w-full bg-border" />
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            <span className="font-semibold">{count}</span> saniye içinde ana sayfaya yönlendirileceksiniz.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="default" size="lg">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/analytics">Analitiklere Git</Link>
            </Button>
          </div>
          
          <div className="mt-8 text-muted-foreground">
            <p>SetScript.com Scraper & Analitik</p>
            <p className="text-sm mt-2">Aradığınız içerik bulunamadı, ancak SetScript.com'da birçok harika proje keşfedebilirsiniz.</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"></div>
    </div>
  );
} 