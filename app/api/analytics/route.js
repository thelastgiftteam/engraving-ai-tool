import { getAnalytics } from '@/lib/db';

export const runtime = 'edge';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'week';
    
    const analytics = await getAnalytics(period);
    
    return Response.json({ 
      success: true, 
      ...analytics 
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
