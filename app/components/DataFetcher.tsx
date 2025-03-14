"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function DataFetcher() {
  const [url, setUrl] = useState('https://setscript.com/developers');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!url || !url.startsWith('https://setscript.com')) {
      setError('Lütfen geçerli bir SetScript.com URL\'si girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/scraper?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Veri çekme işlemi başarısız oldu.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Veri çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const runCronJob = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scraper/cron');
      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: 'Tüm sayfalar başarıyla tarandı ve veriler güncellendi.',
          summary: data.summary
        });
      } else {
        setError(data.error || 'Cron görevi çalıştırılırken bir hata oluştu.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Cron görevi hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Veri Çekme Aracı</CardTitle>
        <CardDescription className="text-muted-foreground">
          SetScript.com'dan veri çekmek için bir URL girin veya tüm sayfaları otomatik olarak tarayın.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="https://setscript.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="bg-background border-border"
            />
            <Button onClick={fetchData} disabled={loading} className="shrink-0">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Veri Çek
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={runCronJob} 
              disabled={loading}
              className="w-full border-border"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tüm Sayfaları Tara
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="border-primary/20 bg-primary/10">
              <AlertTitle>Başarılı</AlertTitle>
              <AlertDescription>
                {result.message || 'Veri başarıyla çekildi.'}
                {result.summary && (
                  <div className="mt-2">
                    <p><strong>Özet:</strong></p>
                    <ul className="list-disc pl-5">
                      <li>Ekip Üyesi Sayısı: {result.summary.teamMemberCount}</li>
                      <li>Toplam Proje Sayısı: {result.summary.totalProjectCount}</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Not: Veri çekme işlemi birkaç saniye sürebilir. Lütfen bekleyin.
      </CardFooter>
    </Card>
  );
} 