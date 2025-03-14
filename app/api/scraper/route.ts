import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  try {
    const response = await fetch(`${url.origin}/api/scrape?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API yönlendirme hatası:', error);
    return NextResponse.json(
      { success: false, error: `API hatası: ${error.message || 'Bilinmeyen hata'}` },
      { status: 500 }
    );
  }
} 