export async function GET(req, { params }) {
  const uid = params.uid;

  const orders = global.orders || [];

  const order = orders.find(
    (o) => String(o.uid) === String(uid)
  );

  return Response.json({ order });
}

export async function PATCH(req, { params }) {
  const uid = params.uid;
  const body = await req.json();

  if (!global.orders) global.orders = [];

  const order = global.orders.find(
    (o) => String(o.uid) === String(uid)
  );

  if (!order) {
    return Response.json({ success: false });
  }

  // update team member
  if (body.teamMember !== undefined) {
    order.teamMember = body.teamMember;
  }

  // update image status
  if (body.imageIndex !== undefined && body.status) {
    if (!order.images[body.imageIndex].status) {
      order.images[body.imageIndex] = {
        url: order.images[body.imageIndex],
        status: body.status,
      };
    } else {
      order.images[body.imageIndex].status = body.status;
    }
  }

  return Response.json({ success: true, order });
}
