import dynamic from 'next/dynamic';

const SummaryCards = dynamic(() => import('../components/analytics/SummaryCards'), {
  loading: () => <p className="text-center p-8">Yükleniyor...</p>
});

const TeamMembersChart = dynamic(() => import('../components/analytics/TeamMembersChart'), {
  loading: () => <p className="text-center p-8">Yükleniyor...</p>
});

const ProjectsChart = dynamic(() => import('../components/analytics/ProjectsChart'), {
  loading: () => <p className="text-center p-8">Yükleniyor...</p>
});

const TeamMembersTable = dynamic(() => import('../components/analytics/TeamMembersTable'), {
  loading: () => <p className="text-center p-8">Yükleniyor...</p>
});

const ProjectsTable = dynamic(() => import('../components/analytics/ProjectsTable'), {
  loading: () => <p className="text-center p-8">Yükleniyor...</p>
});

const DataFetcher = dynamic(() => import('../components/DataFetcher'));

export default function AnalyticsPage() {
  return (
    <main className="flex min-h-screen flex-col py-8 px-4 md:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SetScript.com Analitikleri
            </h1>
            <p className="text-muted-foreground mt-2">
              Tüm veriler her 10 dakikada bir otomatik olarak güncellenir
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Arka planda veri çekme bileşeni */}
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-1 border border-border/50">
              <DataFetcher />
            </section>
            
            {/* Özet kartlar */}
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-1 border border-border/50">
              <SummaryCards />
            </section>
            
            {/* Grafikler */}
            <section className="grid gap-6 md:grid-cols-2">
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-1 border border-border/50">
                <TeamMembersChart />
              </div>
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-1 border border-border/50">
                <ProjectsChart />
              </div>
            </section>
            
            {/* Ekip üyeleri tablosu */}
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-1 border border-border/50">
              <TeamMembersTable />
            </section>
            
            {/* Projeler tablosu */}
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-1 border border-border/50">
              <ProjectsTable />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 