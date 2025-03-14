"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Role {
  id: string;
  name: string;
  color: string;
  position: number;
  members: number;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  roles: string[];
}

export default function DiscordPage() {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscordData = async () => {
    setLoading(true);
    setError(null);

    try {
      const rolesResponse = await fetch('/api/scraper/discord/roles');
      const rolesData = await rolesResponse.json();

      if (!rolesData.success) {
        throw new Error(rolesData.error || 'Roller çekilemedi');
      }

      setRoles(rolesData.roles);

      const usersResponse = await fetch('/api/scraper/discord/users');
      const usersData = await usersResponse.json();

      if (!usersData.success) {
        throw new Error(usersData.error || 'Kullanıcılar çekilemedi');
      }

      setUsers(usersData.users);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
      console.error('Discord veri çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscordData();
  }, []);

  const getRoleColor = (hexColor: string) => {
    if (hexColor === '0') return '#99AAB5'; 
    return `#${parseInt(hexColor).toString(16).padStart(6, '0')}`;
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Discord Sunucu Bilgileri</h1>
          <Button asChild variant="outline">
            <Link href="/scraper">Ana Sayfaya Dön</Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Roller Kartı */}
          <Card className="w-full md:w-1/3 border-border">
            <CardHeader>
              <CardTitle>Roller</CardTitle>
              <CardDescription>Sunucudaki roller ve üye sayıları</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {roles.length > 0 ? (
                    roles
                      .sort((a, b) => b.position - a.position)
                      .map((role) => (
                        <div 
                          key={role.id} 
                          className="p-3 rounded-md border border-border flex justify-between items-center"
                          style={{ borderLeftColor: getRoleColor(role.color), borderLeftWidth: '4px' }}
                        >
                          <span className="font-medium">{role.name}</span>
                          <span className="text-sm text-muted-foreground">{role.members} üye</span>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-muted-foreground">Rol bulunamadı</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={fetchDiscordData} 
                disabled={loading} 
                variant="outline" 
                className="w-full"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Yenile
              </Button>
            </CardFooter>
          </Card>

          {/* Kullanıcılar Kartı */}
          <Card className="w-full md:w-2/3 border-border">
            <CardHeader>
              <CardTitle>Kullanıcılar</CardTitle>
              <CardDescription>Sunucudaki kullanıcılar ve rolleri</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.id} className="p-4 rounded-md border border-border flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold">{user.displayName.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{user.displayName}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {user.roles.map((roleId) => {
                              const role = roles.find(r => r.id === roleId);
                              if (!role) return null;
                              return (
                                <span 
                                  key={roleId} 
                                  className="px-2 py-1 text-xs rounded-full"
                                  style={{ 
                                    backgroundColor: `${getRoleColor(role.color)}20`, 
                                    color: getRoleColor(role.color),
                                    border: `1px solid ${getRoleColor(role.color)}`
                                  }}
                                >
                                  {role.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">Kullanıcı bulunamadı</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={fetchDiscordData} 
                disabled={loading} 
                variant="outline" 
                className="w-full"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Yenile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
} 