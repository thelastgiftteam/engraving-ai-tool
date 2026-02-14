export async function GET() {
  const orders = global.orders || [];

  return new Response(
    JSON.stringify({ orders }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(req) {
  const body = await req.json();

  if (!global.orders) {
    global.orders = [];
  }

  const newOrder = {
    uid: Date.now().toString(),
    orderNumber: body.orderNumber,
    images: body.images || [],
    status: "pending",
    engraver: null,
  };

  global.orders.unshift(newOrder);

  return new Response(
    JSON.stringify({ success: true, order: newOrder }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
