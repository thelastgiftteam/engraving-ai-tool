// Initialize in-memory database
if (!global.orders) {
  global.orders = [];
}

export async function GET() {
  return Response.json({ 
    orders: global.orders,
    success: true 
  });
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.orderNumber) {
      return Response.json(
        { success: false, error: "Order number is required" },
        { status: 400 }
      );
    }

    // Create new order with enhanced structure
    const newOrder = {
      uid: Date.now().toString(),
      orderNumber: body.orderNumber,
      status: "pending", // pending, processing, completed
      teamMember: null,
      claimedAt: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
      images: (body.images || []).filter(url => url.trim() !== "").map((url) => ({
        url: url.trim(),
        thumbnail: extractDriveThumbnail(url),
      })),
    };

    // Add to beginning of array (most recent first)
    global.orders.unshift(newOrder);

    return Response.json({ 
      success: true, 
      order: newOrder 
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Helper function to extract Google Drive thumbnail
function extractDriveThumbnail(url) {
  try {
    // Extract file ID from various Google Drive URL formats
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /folders\/([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Return thumbnail URL
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
      }
    }

    // If no pattern matches, return original URL
    return url;
  } catch {
    return url;
  }
}
