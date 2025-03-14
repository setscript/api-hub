"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface SummaryData {
  teamMemberCount: number;
  totalProjectCount: number;
  dataPointCount: number;
}

export default function SummaryCards() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/scraper/analytics');
        
        if (!response.ok) {
          throw new Error('Analitik verileri alınamadı.');
        }
        
        const data = await response.json();
        setSummary(data.summary || null);
        setLatestTimestamp(data.latestTimestamp || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        console.error('Analitik verileri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    const interval = setInterval(fetchData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yükleniyor...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
              <p className="text-xs text-muted-foreground">Yükleniyor...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hata</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Ekip Üyesi</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.teamMemberCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            SetScript.com ekibindeki toplam üye sayısı
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.totalProjectCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            SetScript.com'da bulunan toplam proje sayısı
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Veri Noktası</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.dataPointCount || 0}</div>
          <p className="text-xs text-muted-foreground">
            Toplanan veri noktası sayısı
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Son Güncelleme</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v10l4.24 4.24" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">
            {latestTimestamp 
              ? new Date(latestTimestamp).toLocaleString('tr-TR')
              : 'Veri yok'
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Verilerin son güncellenme zamanı
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 