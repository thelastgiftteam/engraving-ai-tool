import { getProductTypes } from '@/lib/db';
import { updateEdgeConfig } from '@/lib/updateEdgeConfig';
import { get } from '@vercel/edge-config';

export const runtime = 'edge';

// Get product types
export async function GET() {
  try {
    const productTypes = await getProductTypes();
    
    return Response.json({ 
      success: true, 
      productTypes 
    });
  } catch (error) {
    console.error('Error fetching product types:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch product types' },
      { status: 500 }
    );
  }
}

// Add product type
export async function POST(req) {
  try {
    const body = await req.json();
    
    if (!body.name) {
      return Response.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const productTypes = await get('productTypes') || [];
    const maxId = productTypes.length > 0 ? Math.max(...productTypes.map(pt => pt.id)) : 0;
    
    const newProductType = {
      id: maxId + 1,
      name: body.name,
      active: true,
      createdAt: new Date().toISOString()
    };

    productTypes.push(newProductType);
    await updateEdgeConfig('productTypes', productTypes);

    return Response.json({ 
      success: true, 
      productType: newProductType 
    });
  } catch (error) {
    console.error('Error adding product type:', error);
    return Response.json(
      { success: false, error: 'Failed to add product type' },
      { status: 500 }
    );
  }
}

// Delete product type
export async function DELETE(req) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return Response.json(
        { success: false, error: 'Product type ID is required' },
        { status: 400 }
      );
    }

    const productTypes = await get('productTypes') || [];
    const productType = productTypes.find(pt => pt.id === body.id);
    
    if (productType) {
      productType.active = false;
      await updateEdgeConfig('productTypes', productTypes);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error removing product type:', error);
    return Response.json(
      { success: false, error: 'Failed to remove product type' },
      { status: 500 }
    );
  }
}
