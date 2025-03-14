import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import * as cheerio from 'cheerio';
import nodeFetch from 'node-fetch';

interface TeamMember {
  name: string;
  username: string;
  role: string;
  avatar: string | null;
}

interface Project {
  name: string;
  description: string;
  image: string | null;
  link: string | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  projectsOnPage: number;
}

interface ScrapeResult {
  teamMembers: TeamMember[];
  projects: Project[];
  pagination: Pagination;
}

interface StoredData {
  timestamp: string;
  summary: {
    teamMemberCount: number;
    totalProjectCount: number;
    allProjects: Project[];
    teamMembers: TeamMember[];
  };
}

const DATA_FILE = path.join(process.cwd(), 'data', 'scraped_data.json');

const ensureDataDir = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fsPromises.access(dataDir);
  } catch (error) {
    await fsPromises.mkdir(dataDir, { recursive: true });
  }
};

export const readStoredData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Veri okuma hatası:', error);
    return [];
  }
};

const storeData = async (data: any) => {
  await ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

async function scrapePage(url: string): Promise<ScrapeResult> {
  const response = await nodeFetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const teamMembers: TeamMember[] = [];
  $('.team-member-card, .developer-card, .user-card, .member-card, .team-member').each((_, card) => {
    const name = $(card).find('.name, .user-name, h3, h4, .title').first().text().trim();
    const username = $(card).find('.username, .user-handle, .handle, .user-id').first().text().trim().replace('@', '');
    const role = $(card).find('.role, .position, .title, .user-role').first().text().trim();
    const avatar = $(card).find('img').attr('src');
    
    if (name || username) {
      teamMembers.push({
        name: name || username,
        username: username || name.toLowerCase().replace(/\s+/g, ''),
        role: role || '',
        avatar: avatar || null
      });
    }
  });

  const projects: Project[] = [];
  $('.project-card, .code-card, .card, .project, .code-item').each((_, card) => {
    const name = $(card).find('.project-name, .code-name, h3, h4, .title, .name').first().text().trim();
    const description = $(card).find('.project-description, .code-description, p, .description, .details').first().text().trim();
    const image = $(card).find('img').attr('src');
    const link = $(card).find('a').attr('href');
    
    if (name) {
      projects.push({
        name,
        description: description || '',
        image: image || null,
        link: link || null
      });
    }
  });

  const pagination: Pagination = {
    currentPage: 1,
    totalPages: 1,
    projectsOnPage: projects.length
  };

  const urlObj = new URL(url);
  const pageParam = urlObj.searchParams.get('page');
  if (pageParam) {
    pagination.currentPage = parseInt(pageParam);
  }

  const lastPageLink = $('.pagination a').last().attr('href');
  if (lastPageLink) {
    const lastPageMatch = lastPageLink.match(/page=(\d+)/);
    if (lastPageMatch) {
      pagination.totalPages = parseInt(lastPageMatch[1]);
    }
  }

  return {
    teamMembers,
    projects,
    pagination
  };
}

async function scrapeSetScriptPage(url: string): Promise<ScrapeResult> {
  try {
    console.log(`Taranıyor: ${url}`);
    const response = await nodeFetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const teamMembers: TeamMember[] = [];
    
    if (url.includes('/developers')) {
      $('.relative.h-full.flex.flex-col.justify-end.p-6.z-30').each((_, card) => {
        const username = $(card).find('h2').text().trim().replace('@', '');
        const name = username; 
        const roleElement = $(card).find('.text-muted-foreground.capitalize');
        const role = roleElement.text().trim();
        
        if (username) {
          teamMembers.push({
            name,
            username,
            role,
            avatar: null
          });
        }
      });
      
      $('.team-member-card, .developer-card, .user-card, .member-card, .team-member').each((_, card) => {
        const name = $(card).find('.name, .user-name, h3, h4, .title, h2').first().text().trim().replace('@', '');
        const username = $(card).find('.username, .user-handle, .handle, .user-id').first().text().trim().replace('@', '') || name;
        const role = $(card).find('.role, .position, .title, .user-role, .text-muted-foreground.capitalize').first().text().trim();
        const avatar = $(card).find('img').attr('src');
        
        if (name || username) {
          teamMembers.push({
            name: name || username,
            username: username || name.toLowerCase().replace(/\s+/g, ''),
            role: role || '',
            avatar: avatar || null
          });
        }
      });
      
      $('h2:contains("Tüm Geliştiriciler")').next().find('a').each((_, link) => {
        const text = $(link).text().trim();
        if (text && text !== 'Tüm Geliştiriciler') {
          const parts = text.split('(');
          const name = parts[0].trim();
          let role = '';
          
          if (parts.length > 1) {
            role = parts[1].replace(')', '').trim();
          }
          
          teamMembers.push({
            name,
            username: name.toLowerCase().replace(/\s+/g, ''),
            role,
            avatar: null
          });
        }
      });
    }
    
    const projects: Project[] = [];
    
    if (url.includes('/kodlar')) {
      $('a.group.relative.overflow-hidden.rounded-lg, a.card').each((_, card) => {
        const name = $(card).find('h3').text().trim();
        const description = $(card).find('p.text-sm.text-muted-foreground').text().trim();
        const image = $(card).find('img').attr('src');
        const link = $(card).attr('href');
        
        if (name) {
          projects.push({
            name,
            description: description || '',
            image: image || null,
            link: link || null
          });
        }
      });
      
      $('.project-card, .code-card, .card, .project, .code-item').each((_, card) => {
        const name = $(card).find('.project-name, .code-name, h3, h4, .title, .name').first().text().trim();
        const description = $(card).find('.project-description, .code-description, p, .description, .details').first().text().trim();
        const image = $(card).find('img').attr('src');
        const link = $(card).find('a').attr('href');
        
        if (name) {
          projects.push({
            name,
            description: description || '',
            image: image || null,
            link: link || null
          });
        }
      });
      
      const noProjectsText = $('body').text().includes('Toplam 0 proje bulundu');
      if (noProjectsText) {
        console.log(`Toplam 0 proje bulundu: ${url}`);
        return {
          teamMembers,
          projects: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            projectsOnPage: 0
          }
        };
      }
    }
    
    const pagination: Pagination = {
      currentPage: 1,
      totalPages: 1,
      projectsOnPage: projects.length
    };
    
    const urlObj = new URL(url);
    const pageParam = urlObj.searchParams.get('page');
    if (pageParam) {
      pagination.currentPage = parseInt(pageParam);
    }
    
    const lastPageLink = $('.pagination a').last().attr('href');
    if (lastPageLink) {
      const lastPageMatch = lastPageLink.match(/page=(\d+)/);
      if (lastPageMatch) {
        pagination.totalPages = parseInt(lastPageMatch[1]);
      }
    }
    
    return {
      teamMembers,
      projects,
      pagination
    };
  } catch (error) {
    console.error(`Sayfa tarama hatası (${url}):`, error);
    return {
      teamMembers: [],
      projects: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        projectsOnPage: 0
      }
    };
  }
}

const scrapeAllPages = async (): Promise<StoredData> => {
  try {
    const teamMembers: TeamMember[] = [];
    const allProjects: Project[] = [];
    let totalProjectCount = 0;

    console.log('Developers sayfası taranıyor...');
    const developersData = await scrapeSetScriptPage('https://setscript.com/developers');
    
    if (developersData.teamMembers.length > 0) {
      teamMembers.push(...developersData.teamMembers);
      console.log(`${teamMembers.length} ekip üyesi bulundu`);
    } else {
      console.log('Ekip üyeleri bulunamadı, alternatif yöntemler deneniyor...');
      
      const mainPageData = await scrapeSetScriptPage('https://setscript.com');
      if (mainPageData.teamMembers.length > 0) {
        teamMembers.push(...mainPageData.teamMembers);
        console.log(`Ana sayfadan ${mainPageData.teamMembers.length} ekip üyesi bulundu`);
      }
      
      const kodlarPageData = await scrapeSetScriptPage('https://setscript.com/kodlar');
      if (kodlarPageData.teamMembers.length > 0) {
        const existingUsernames = new Set(teamMembers.map(member => member.username));
        const newMembers = kodlarPageData.teamMembers.filter(member => !existingUsernames.has(member.username));
        
        teamMembers.push(...newMembers);
        console.log(`Kodlar sayfasından ${newMembers.length} ekip üyesi bulundu`);
      }
    }

    console.log('İlk kodlar sayfası taranıyor...');
    const firstPageData = await scrapeSetScriptPage('https://setscript.com/kodlar');
    
    if (firstPageData.projects.length > 0) {
      allProjects.push(...firstPageData.projects);
      totalProjectCount += firstPageData.pagination.projectsOnPage;
      console.log(`İlk sayfada ${firstPageData.projects.length} proje bulundu`);
    } else {
      console.log('İlk sayfada proje bulunamadı, diğer sayfalar kontrol ediliyor...');
    }

    let currentPage = 1;
    let hasMorePages = true;
    
    while (hasMorePages) {
      currentPage++;
      
      const pageData = await scrapeSetScriptPage(`https://setscript.com/kodlar?page=${currentPage}`);
      
      console.log(`Sayfa ${currentPage}: ${pageData.projects.length} proje bulundu`);
      
      if (pageData.projects.length === 0) {
        console.log(`Toplam 0 proje bulundu: https://setscript.com/kodlar?page=${currentPage}`);
        hasMorePages = false;
        break;
      }
      
      allProjects.push(...pageData.projects);
      totalProjectCount += pageData.pagination.projectsOnPage;
    }

    const uniqueProjects: Project[] = [];
    const projectNames = new Set<string>();
    
    allProjects.forEach(project => {
      if (project.name && !projectNames.has(project.name)) {
        projectNames.add(project.name);
        uniqueProjects.push(project);
      }
    });
    
    console.log(`Toplam ${teamMembers.length} ekip üyesi ve ${uniqueProjects.length} proje bulundu`);
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        teamMemberCount: teamMembers.length,
        totalProjectCount: uniqueProjects.length,
        allProjects: uniqueProjects,
        teamMembers
      }
    };
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    throw error;
  }
};

export async function GET() {
  try {
    const existingData = readStoredData();
    
    const newData = await scrapeAllPages();
    
    existingData.push(newData);
    
    const dataToStore = existingData.slice(-100);
    
    await storeData(dataToStore);
    
    return NextResponse.json({
      success: true,
      message: 'Cron görevi başarıyla çalıştı ve veriler güncellendi.',
      timestamp: newData.timestamp,
      summary: newData.summary
    });
  } catch (error) {
    console.error('Cron API hatası:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Cron görevi çalıştırılırken bir hata oluştu.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 