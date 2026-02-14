export async function GET(req, { params }) {
  const { uid } = params;

  if (!global.orders) global.orders = [];

  const order = global.orders.find((o) => o.uid === uid);

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
}

export async function PATCH(req, { params }) {
  try {
    const { uid } = params;
    const body = await req.json();

    if (!global.orders) global.orders = [];

    const orderIndex = global.orders.findIndex((o) => o.uid === uid);

    if (orderIndex === -1) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const order = global.orders[orderIndex];

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

      // Update timestamps
      if (body.status === "processing") {
        order.claimedAt = new Date().toISOString();
        order.teamMember = body.teamMember || order.teamMember;
      }

      if (body.status === "completed") {
        order.completedAt = new Date().toISOString();
      }
    }

    // Update team member if provided
    if (body.teamMember) {
      order.teamMember = body.teamMember;
    }

    global.orders[orderIndex] = order;

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
