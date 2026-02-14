export async function GET() {
  if (!global.orders) global.orders = [];

  return Response.json({ orders: global.orders });
}

export async function POST(req) {
  const body = await req.json();

  if (!global.orders) global.orders = [];

  const newOrder = {
    uid: Date.now().toString(),
    orderNumber: body.orderNumber,
    teamMember: "",
    images: (body.images || []).map((url) => ({
      url,
      status: "pending",
    })),
  };

  global.orders.unshift(newOrder);

  return Response.json({ success: true, order: newOrder });
}
