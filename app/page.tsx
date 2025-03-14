import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-black text-white">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Başlık */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">API Hub</h1>
          <p className="text-lg text-gray-400">Tüm API servislerimize buradan erişebilirsiniz.</p>
        </div>

        {/* API Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SetScript.com Scraper */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-xl">SetScript.com Scraper</CardTitle>
              <CardDescription className="text-gray-400">
                SetScript.com web sitesinden veri çekme ve analiz servisi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                SetScript.com web sitesinden veri çekin, analiz edin ve görselleştirin. Ekip üyeleri ve projeler hakkında detaylı bilgiler edinin.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                <Link href="/scraper">Scraper'a Git</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Discord Bot API */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Discord Bot API</CardTitle>
              <CardDescription className="text-gray-400">
                Discord sunucunuzdaki rolleri ve kullanıcıları çekin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Discord botumuz aracılığıyla sunucunuzdaki rolleri ve kullanıcıları erişilebilir API olarak alın. Kullanıcı yönetimi için ideal.
              </p>
              <div className="mt-4 p-3 bg-zinc-950 rounded-md text-xs font-mono">
                <p className="text-gray-400">API Endpoint:</p>
                <p className="text-green-500">/api/scraper/discord</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Link href="/scraper/discord">Discord Developer Portal</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* API Dokümantasyonu */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">API Dokümantasyonu</h2>
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">SetScript.com Scraper API</h3>
                  <div className="p-3 bg-zinc-950 rounded-md font-mono text-sm">
                    <p className="text-gray-400">Veri Çekme:</p>
                    <p className="text-green-500">GET /api/scraper?url=https://setscript.com/developers</p>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-md font-mono text-sm mt-2">
                    <p className="text-gray-400">Analitikler:</p>
                    <p className="text-green-500">GET /api/scraper/analytics</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Discord Bot API</h3>
                  <div className="p-3 bg-zinc-950 rounded-md font-mono text-sm">
                    <p className="text-gray-400">Sunucu Bilgileri, Roller ve Kullanıcılar:</p>
                    <p className="text-green-500">GET /api/scraper/discord</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
