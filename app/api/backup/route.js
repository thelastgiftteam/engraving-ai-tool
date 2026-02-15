import { get } from '@vercel/edge-config';

export const runtime = 'edge';

export async function GET() {
  try {
    // Fetch all data from Edge Config
    const orders = await get('orders') || [];
    const employees = await get('employees') || [];
    const productTypes = await get('productTypes') || [];
    const processingLogs = await get('processingLogs') || [];

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        orders,
        employees,
        productTypes,
        processingLogs
      },
      stats: {
        orders: orders.length,
        employees: employees.length,
        productTypes: productTypes.length,
        processingLogs: processingLogs.length
      }
    };

    return new Response(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="edge-config-backup-${Date.now()}.json"`
      }
    });
  } catch (error) {
    console.error('Backup error:', error);
    return Response.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
