let ORDERS = [];

export async function GET() {
  return Response.json(ORDERS);
}

export async function POST(req) {
  const body = await req.json();

  const newOrder = {
    uid: Date.now().toString(),
    orderNumber: body.orderNumber,
    images: body.images || [],
    engraver: "",
    status: "pending",
  };

  ORDERS.unshift(newOrder);

  return Response.json(newOrder);
}

export async function PATCH(req) {
  const body = await req.json();

  const order = ORDERS.find((o) => o.uid === body.uid);

  if (order) {
    Object.assign(order, body.updates);
  }

  return Response.json(order);
}
