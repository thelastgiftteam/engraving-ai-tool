import { getAllOrders, getEmployees } from '@/lib/db';
import { updateEdgeConfig } from '@/lib/updateEdgeConfig';
import { get } from '@vercel/edge-config';

export const runtime = 'edge';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return Response.json({ 
      orders: orders,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
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

    const uid = Date.now().toString();
    
    // Get current orders
    const orders = await get('orders') || [];
    const employees = await get('employees') || [];
    const productTypes = await get('productTypes') || [];

    // Find designer
    const designer = employees.find(e => e.id === body.designerId);

    // Process images with product types
    const processedImages = (body.images || [])
      .filter(img => img.url && img.url.trim() !== "")
      .map((img) => {
        const productType = productTypes.find(pt => pt.id === img.productTypeId);
        return {
          url: img.url.trim(),
          thumbnail: extractDriveThumbnail(img.url),
          productTypeId: img.productTypeId || null,
          productType: productType?.name || null
        };
      });

    // Create new order
    const newOrder = {
      uid,
      orderNumber: body.orderNumber,
      status: 'pending',
      designerId: body.designerId || null,
      designer: designer?.name || null,
      engraverId: null,
      teamMember: null,
      createdAt: new Date().toISOString(),
      claimedAt: null,
      completedAt: null,
      images: processedImages
    };

    // Add to beginning of array (most recent first)
    orders.unshift(newOrder);

    // Update Edge Config
    await updateEdgeConfig('orders', orders);

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
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /folders\/([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
      }
    }

    return url;
  } catch {
    return url;
  }
}
