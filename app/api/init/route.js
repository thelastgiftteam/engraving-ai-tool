import { updateEdgeConfig } from '@/lib/updateEdgeConfig';
import { getDefaultData } from '@/lib/db';

export async function GET() {
  try {
    const defaultData = getDefaultData();
    
    // Initialize all data in Edge Config
    await updateEdgeConfig('orders', defaultData.orders);
    await updateEdgeConfig('employees', defaultData.employees);
    await updateEdgeConfig('productTypes', defaultData.productTypes);
    await updateEdgeConfig('processingLogs', defaultData.processingLogs);

    return Response.json({ 
      success: true, 
      message: 'Database initialized successfully',
      data: defaultData
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
