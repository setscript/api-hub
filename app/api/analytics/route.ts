import { NextResponse } from 'next/server';
import { readStoredData } from '../cron/route';

export async function GET() {
  try {
    const data = readStoredData();
    
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Henüz depolanmış veri bulunmuyor.',
        data: []
      }, { status: 404 });
    }
    
    const latestData = data[data.length - 1];
    const teamMemberCount = latestData.summary.teamMemberCount;
    const totalProjectCount = latestData.summary.totalProjectCount;
    
    const timeSeriesData = data.map(item => ({
      timestamp: item.timestamp,
      teamMemberCount: item.summary.teamMemberCount,
      totalProjectCount: item.summary.totalProjectCount
    }));
    
    return NextResponse.json({
      success: true,
      latestTimestamp: latestData.timestamp,
      summary: {
        teamMemberCount,
        totalProjectCount,
        dataPointCount: data.length
      },
      timeSeriesData,
      projectsData: latestData.summary.allProjects,
      teamMembersData: latestData.summary.teamMembers,
      rawData: data
    });
  } catch (error) {
    console.error('Analytics API hatası:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Analitik verileri işlenirken bir hata oluştu.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 