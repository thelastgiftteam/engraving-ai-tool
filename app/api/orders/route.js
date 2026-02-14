let ORDERS = [];

export async function GET() {
  return Response.json(ORDERS);
}

export async function POST(req) {
  const body = await req.json();

  const newOrder = {
    id: Date.now().toString(),
    orderNumber: body.orderNumber,
    images: body.images || [],
    status: "pending",
    engravingBy: null,
    createdAt: new Date().toISOString(),
  };

  ORDERS.unshift(newOrder);

  return Response.json(newOrder);
}
