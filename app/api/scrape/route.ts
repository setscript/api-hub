import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

interface ContentItem {
  type: string;
  text: string;
  href: string | null;
}

interface TeamMember {
  name: string;
  username: string;
  role: string;
  avatar?: string | null;
}

interface Project {
  name: string;
  description?: string;
  image?: string | null;
  link?: string | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  projectsOnPage: number;
}

interface SpecialData {
  teamMembers?: TeamMember[];
  projects?: Project[];
  pagination?: Pagination;
}

async function scrapeWebsite(url: string) {
  try {
    if (!url || !url.startsWith('https://setscript.com')) {
      throw new Error('Geçersiz URL. Sadece setscript.com adresleri taranabilir.');
    }

    const urlObj = new URL(url);
    const page = urlObj.pathname;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sayfa çekilemedi: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const content: ContentItem[] = [];
    
    $('body').find('p, h1, h2, h3, h4, h5, h6, span, a, div').each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        content.push({
          type: element.name,
          text,
          href: $(element).attr('href') || null
        });
      }
    });
    
    const specialData: SpecialData = {};
    
    if (page === '/developers') {
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

      if (teamMembers.length === 0) {
        $('table').each((_, table) => {
          $(table).find('tr').each((_, row) => {
            const cells = $(row).find('td');
            if (cells.length >= 2) {
              const name = $(cells[0]).text().trim();
              const username = $(cells[1]).text().trim().replace('@', '');
              const role = cells.length >= 3 ? $(cells[2]).text().trim() : '';
              
              if (name && username && !name.includes('İsim') && !username.includes('Kullanıcı')) {
                teamMembers.push({ name, username, role });
              }
            }
          });
        });
      }

      if (teamMembers.length === 0) {
        $('ul, ol').each((_, list) => {
          $(list).find('li').each((_, item) => {
            const text = $(item).text().trim();
            const matches = text.match(/([^@]+)@([^\s]+)(?:\s+(.+))?/);
            
            if (matches) {
              const [, name, username, role = ''] = matches;
              teamMembers.push({
                name: name.trim(),
                username: username.trim(),
                role: role.trim()
              });
            }
          });
        });
      }

      specialData.teamMembers = teamMembers;
    }
    
    if (page === '/kodlar' || page.startsWith('/kodlar?')) {
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

      if (projects.length === 0) {
        $('table').each((_, table) => {
          $(table).find('tr').each((_, row) => {
            const cells = $(row).find('td');
            if (cells.length >= 2) {
              const name = $(cells[0]).text().trim();
              const description = $(cells[1]).text().trim();
              
              if (name && !name.includes('Proje') && !name.includes('İsim')) {
                projects.push({ name, description });
              }
            }
          });
        });
      }

      if (projects.length === 0) {
        $('ul, ol').each((_, list) => {
          $(list).find('li').each((_, item) => {
            const name = $(item).find('strong, b, .name, .title').first().text().trim() || 
                        $(item).contents().first().text().trim();
            const description = $(item).find('p, .description').first().text().trim() ||
                              $(item).contents().not('strong, b, .name, .title').text().trim();
            
            if (name && !name.includes('Proje') && !name.includes('İsim')) {
              projects.push({ name, description });
            }
          });
        });
      }

      const pagination: Pagination = {
        currentPage: parseInt(urlObj.searchParams.get('page') || '1'),
        totalPages: 1,
        projectsOnPage: projects.length
      };

      const lastPageLink = $('.pagination a').last().attr('href');
      if (lastPageLink) {
        const lastPageMatch = lastPageLink.match(/page=(\d+)/);
        if (lastPageMatch) {
          pagination.totalPages = parseInt(lastPageMatch[1]);
        }
      }

      specialData.projects = projects;
      specialData.pagination = pagination;
    }
    
    return {
      success: true,
      page,
      url,
      timestamp: new Date().toISOString(),
      data: {
        title: $('title').text(),
        content,
        specialData
      }
    };
  } catch (error: unknown) {
    console.error('Scraping hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      timestamp: new Date().toISOString()
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL parametresi gereklidir.',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    const result = await scrapeWebsite(url);
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 