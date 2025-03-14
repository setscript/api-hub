"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";

interface TeamMember {
  name: string;
  username: string;
  role: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

export default function TeamMembersChart() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
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
        setTeamMembers(data.teamMembersData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        console.error('Analitik verileri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const roleData = teamMembers.reduce((acc, member) => {
    const role = member.role || 'Belirtilmemiş';
    
    if (!acc[role]) {
      acc[role] = 0;
    }
    
    acc[role]++;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(roleData).map(([name, value]) => ({
    name,
    value
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ekip Üyeleri</CardTitle>
          <CardDescription>Rol bazında ekip üyesi dağılımı</CardDescription>
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
          <CardTitle>Ekip Üyeleri</CardTitle>
          <CardDescription>Rol bazında ekip üyesi dağılımı</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-red-500">Hata: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ekip Üyeleri</CardTitle>
        <CardDescription>Rol bazında ekip üyesi dağılımı - Toplam: {teamMembers.length} üye</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} üye`, 'Sayı']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p>Henüz ekip üyesi verisi bulunmuyor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 