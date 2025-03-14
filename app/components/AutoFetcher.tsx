"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AutoFetcher() {
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [nextFetch, setNextFetch] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(600);

  const fetchData = async () => {
    try {
      setStatus('fetching');
      setError(null);
      
      const response = await fetch('/api/cron');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Veri çekme işlemi başarısız oldu.');
      }
      
      const data = await response.json();
      setLastFetch(data.timestamp);
      const nextFetchTime = new Date();
      nextFetchTime.setMinutes(nextFetchTime.getMinutes() + 10);
      setNextFetch(nextFetchTime.toISOString());
      setStatus('success');
      setCountdown(600); 
      
      console.log('Veri başarıyla çekildi:', data);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
      console.error('Veri çekme hatası:', err);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 600000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between text-2xl">
          Otomatik Veri Toplama
          <Badge 
            variant={status === 'fetching' ? 'outline' : status === 'success' ? 'default' : 'destructive'}
            className={status === 'success' ? 'bg-primary/20 text-primary border-primary/30' : 
                      status === 'fetching' ? 'bg-secondary/20 text-secondary-foreground border-secondary/30' : 
                      'bg-destructive/20 text-destructive border-destructive/30'}
          >
            {status === 'fetching' ? (
              <span className="flex items-center">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Çalışıyor
              </span>
            ) : status === 'success' ? (
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3" />
                Aktif
              </span>
            ) : (
              <span className="flex items-center">
                <XCircle className="mr-1 h-3 w-3" />
                Hata
              </span>
            )}
          </Badge>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          SetScript.com'dan her 10 dakikada bir otomatik olarak veri toplanır.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-border bg-card/50 p-3">
              <div className="text-sm font-medium">Son Veri Çekme</div>
              <div className="mt-1 text-lg">
                {lastFetch ? new Date(lastFetch).toLocaleTimeString('tr-TR') : '-'}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {lastFetch ? new Date(lastFetch).toLocaleDateString('tr-TR') : ''}
              </div>
            </div>
            
            <div className="rounded-md border border-border bg-card/50 p-3">
              <div className="text-sm font-medium">Sonraki Veri Çekme</div>
              <div className="mt-1 text-lg">
                {formatCountdown()}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {nextFetch ? new Date(nextFetch).toLocaleTimeString('tr-TR') : '-'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Veri toplama işlemi arka planda otomatik olarak çalışır.
      </CardFooter>
    </Card>
  );
} 