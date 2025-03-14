"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Project {
  name: string;
  link?: string | null;
  description: string;
}

const truncateText = (text: string, maxLength: number = 30) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
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
        
        const processedProjects = (data.projectsData || []).map((project: Project) => {
          if (project.link && !project.link.startsWith('http')) {
            return {
              ...project,
              link: `https://setscript.com${project.link.startsWith('/') ? '' : '/'}${project.link}`
            };
          }
          return project;
        });
        
        setProjects(processedProjects);
        setFilteredProjects(processedProjects);
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
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projeler</CardTitle>
          <CardDescription>SetScript.com'daki tüm projeler</CardDescription>
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
          <CardTitle>Projeler</CardTitle>
          <CardDescription>SetScript.com'daki tüm projeler</CardDescription>
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
        <CardTitle>Projeler</CardTitle>
        <CardDescription>SetScript.com'daki tüm projeler - Toplam: {projects.length} proje</CardDescription>
        <div className="mt-4">
          <Input
            placeholder="Proje ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>SetScript.com'daki projeler listesi</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Proje Adı</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Bağlantı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Tooltip content={<p>{project.name}</p>}>
                      <TooltipTrigger>
                        {truncateText(project.name, 25)}
                      </TooltipTrigger>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={<p>{project.description || "Açıklama yok"}</p>}>
                      <TooltipTrigger>
                        {truncateText(project.description || "Açıklama yok", 40)}
                      </TooltipTrigger>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Görüntüle
                      </a>
                    ) : (
                      <span className="text-gray-400">Bağlantı yok</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Henüz proje verisi bulunmuyor."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 