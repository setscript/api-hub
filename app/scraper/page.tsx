import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ScraperForm = dynamic(() => import("@/app/components/ScraperForm"), {
  loading: () => <p className="text-center py-4">Form yükleniyor...</p>
});

const AutoFetcher = dynamic(() => import("@/app/components/AutoFetcher"), {
  loading: () => <p className="text-center py-4">Otomatik veri toplama yükleniyor...</p>
});

export default function ScraperPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto space-y-12">
        {/* Hero Bölümü */}
        <div className="text-center space-y-6 py-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            SetScript.com Scraper & Analitik
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SetScript.com web sitesinden veri çekin, analiz edin ve görselleştirin.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/scraper/analytics">Analitikleri Görüntüle</Link>
            </Button>
          </div>
        </div>

        {/* Özellikler Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Veri Çekme</CardTitle>
              <CardDescription className="text-muted-foreground">
                SetScript.com'dan istediğiniz sayfanın verilerini çekin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Herhangi bir SetScript.com sayfasından veri çekebilir, projeleri ve ekip üyelerini listeleyebilirsiniz.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full rounded-full border-border">
                <Link href="#scraper">Veri Çek</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Otomatik İzleme</CardTitle>
              <CardDescription className="text-muted-foreground">
                SetScript.com'u otomatik olarak izleyin ve değişiklikleri takip edin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Her 10 dakikada bir otomatik olarak veri toplanır ve değişiklikler kaydedilir.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full rounded-full border-border">
                <Link href="#auto-fetcher">İzleme Durumu</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Discord Entegrasyonu</CardTitle>
              <CardDescription className="text-muted-foreground">
                Discord sunucunuzdaki rolleri ve kullanıcıları görüntüleyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discord botumuz ile sunucunuzdaki rolleri ve kullanıcıları API üzerinden çekebilirsiniz.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full rounded-full">
                <Link href="/scraper/discord">Discord'a Git</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Otomatik Veri Toplama Bölümü */}
        <div id="auto-fetcher" className="pt-8 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Otomatik Veri Toplama Durumu</h2>
          <AutoFetcher />
        </div>

        {/* Manuel Veri Çekme Bölümü */}
        <div id="scraper" className="pt-8 pb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Manuel Veri Çekme</h2>
          <ScraperForm />
        </div>
      </div>
    </main>
  );
} 