"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamMember {
  name: string;
  username: string;
  role: string;
}

const truncateText = (text: string, maxLength: number = 30) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default function TeamMembersTable() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredMembers(data.teamMembersData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
        console.error('Analitik verileri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, teamMembers]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Takım Üyeleri</CardTitle>
          <CardDescription>SetScript.com'daki tüm takım üyeleri</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <p>Yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Takım Üyeleri</CardTitle>
          <CardDescription>SetScript.com'daki tüm takım üyeleri</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <p className="text-red-500">Hata: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Takım Üyeleri</CardTitle>
        <CardDescription>SetScript.com'daki tüm takım üyeleri - Toplam: {teamMembers.length} üye</CardDescription>
        <div className="mt-4">
          <Input
            placeholder="Üye ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>SetScript.com'daki takım üyeleri listesi</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Kullanıcı Adı</TableHead>
              <TableHead>Rol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Tooltip content={<p>{member.name}</p>}>
                      <TooltipTrigger>
                        {truncateText(member.name, 25)}
                      </TooltipTrigger>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={<p>{member.username}</p>}>
                      <TooltipTrigger>
                        {truncateText(member.username, 25)}
                      </TooltipTrigger>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={<p>{member.role}</p>}>
                      <TooltipTrigger>
                        {truncateText(member.role, 25)}
                      </TooltipTrigger>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Henüz takım üyesi verisi bulunmuyor."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 