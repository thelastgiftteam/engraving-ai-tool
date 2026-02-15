import { updateEdgeConfig } from '@/lib/updateEdgeConfig';

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate backup data structure
    if (!body.data) {
      return Response.json(
        { success: false, error: 'Invalid backup file - missing data field' },
        { status: 400 }
      );
    }

    const { orders, employees, productTypes, processingLogs } = body.data;

    // Restore each dataset
    const results = {
      orders: false,
      employees: false,
      productTypes: false,
      processingLogs: false
    };

    if (orders) {
      const result = await updateEdgeConfig('orders', orders);
      results.orders = result.success || false;
    }

    if (employees) {
      const result = await updateEdgeConfig('employees', employees);
      results.employees = result.success || false;
    }

    if (productTypes) {
      const result = await updateEdgeConfig('productTypes', productTypes);
      results.productTypes = result.success || false;
    }

    if (processingLogs) {
      const result = await updateEdgeConfig('processingLogs', processingLogs);
      results.processingLogs = result.success || false;
    }

    // Check if all restorations succeeded
    const allSuccess = Object.values(results).every(r => r === true);

    return Response.json({
      success: allSuccess,
      message: allSuccess ? 'Data restored successfully' : 'Some data failed to restore',
      results,
      stats: {
        orders: orders?.length || 0,
        employees: employees?.length || 0,
        productTypes: productTypes?.length || 0,
        processingLogs: processingLogs?.length || 0
      }
    });

  } catch (error) {
    console.error('Restore error:', error);
    return Response.json(
      { success: false, error: 'Failed to restore backup: ' + error.message },
      { status: 500 }
    );
  }
}
