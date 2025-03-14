"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

interface TimeSeriesData {
  timestamp: string;
  teamMemberCount: number;
  totalProjectCount: number;
}

export default function ProjectsChart() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
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
        setTimeSeriesData(data.timeSeriesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        console.error('Analitik verileri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const chartData = timeSeriesData.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('tr-TR'),
    projeSayısı: item.totalProjectCount
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proje Sayısı Değişimi</CardTitle>
          <CardDescription>Zaman içinde toplam proje sayısı değişimi</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p>Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proje Sayısı Değişimi</CardTitle>
          <CardDescription>Zaman içinde toplam proje sayısı değişimi</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-red-500">Hata: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const latestProjectCount = chartData.length > 0 
    ? chartData[chartData.length - 1].projeSayısı 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proje Sayısı Değişimi</CardTitle>
        <CardDescription>Zaman içinde toplam proje sayısı değişimi - Güncel: {latestProjectCount} proje</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projeSayısı" fill="#8884d8" name="Proje Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p>Henüz proje verisi bulunmuyor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 