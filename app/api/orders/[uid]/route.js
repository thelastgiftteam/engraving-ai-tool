import { getOrder } from '@/lib/db';
import { updateEdgeConfig } from '@/lib/updateEdgeConfig';
import { get } from '@vercel/edge-config';

export const runtime = 'edge';

export async function GET(req, { params }) {
  try {
    const { uid } = params;
    const order = await getOrder(uid);

    if (!order) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json({ 
      success: true, 
      order 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { uid } = params;
    const body = await req.json();

    const orders = await get('orders') || [];
    const employees = await get('employees') || [];
    
    const orderIndex = orders.findIndex((o) => o.uid === uid);

    if (orderIndex === -1) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orders[orderIndex];

    // Validate status transitions
    if (body.status) {
      // Prevent claiming already claimed orders
      if (body.status === "processing" && order.status === "processing") {
        return Response.json(
          { success: false, error: "Order is already being processed" },
          { status: 400 }
        );
      }

      // Update status
      order.status = body.status;

      // Update timestamps and team member
      if (body.status === "processing") {
        order.claimedAt = new Date().toISOString();
        const engraver = employees.find(e => e.id === body.engraverId);
        order.engraverId = body.engraverId;
        order.teamMember = engraver?.name || body.teamMember;
      }

      if (body.status === "completed") {
        order.completedAt = new Date().toISOString();

        // Log processing time
        if (order.claimedAt && order.teamMember) {
          const startTime = new Date(order.claimedAt);
          const endTime = new Date();
          const durationMinutes = Math.round((endTime - startTime) / 60000);

          const logs = await get('processingLogs') || [];
          
          const productTypes = order.images
            .map(img => img.productType)
            .filter(Boolean)
            .join(', ');

          logs.unshift({
            orderId: order.uid,
            orderNumber: order.orderNumber,
            employeeId: order.engraverId,
            employeeName: order.teamMember,
            productTypes: productTypes,
            startTime: order.claimedAt,
            endTime: order.completedAt,
            durationMinutes,
            createdAt: new Date().toISOString()
          });

          // Keep only last 1000 logs
          if (logs.length > 1000) {
            logs.splice(1000);
          }

          await updateEdgeConfig('processingLogs', logs);
        }
      }
    }

    // Update team member if provided
    if (body.teamMember) {
      order.teamMember = body.teamMember;
    }

    orders[orderIndex] = order;

    // Update Edge Config
    await updateEdgeConfig('orders', orders);

    return Response.json({ 
      success: true, 
      order 
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
