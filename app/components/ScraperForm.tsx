"use client";

import dynamic from 'next/dynamic';

const DataFetcher = dynamic(() => import('./DataFetcher'), {
  loading: () => <p>Veri çekme aracı yükleniyor...</p>
});

export default function ScraperForm() {
  return <DataFetcher />;
} 