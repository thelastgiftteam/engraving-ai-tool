import { getCompletedOrders } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const orders = await getCompletedOrders(50);
    
    return Response.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch completed orders' },
      { status: 500 }
    );
  }
}
