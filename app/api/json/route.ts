import { NextResponse } from 'next/server';
import { readStoredData } from '../cron/route';

export async function GET() {
  try {
    const storedData = await readStoredData();
    
    if (!storedData || storedData.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Henüz veri bulunmuyor.'
      });
    }
    
    const latestData = storedData[storedData.length - 1];
    
    return NextResponse.json({
      success: true,
      timestamp: latestData.timestamp,
      data: latestData
    });
  } catch (error) {
    console.error('JSON API hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Veri alınırken bir hata oluştu.' 
      },
      { status: 500 }
    );
  }
} 