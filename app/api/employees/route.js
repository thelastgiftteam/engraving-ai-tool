import { getEmployees } from '@/lib/db';
import { updateEdgeConfig } from '@/lib/updateEdgeConfig';
import { get } from '@vercel/edge-config';

export const runtime = 'edge';

// Get employees
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    
    const employees = await getEmployees(role);
    
    return Response.json({ 
      success: true, 
      employees 
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// Add employee
export async function POST(req) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.role) {
      return Response.json(
        { success: false, error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const employees = await get('employees') || [];
    const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) : 0;
    
    const newEmployee = {
      id: maxId + 1,
      name: body.name,
      role: body.role,
      active: true,
      createdAt: new Date().toISOString()
    };

    employees.push(newEmployee);
    await updateEdgeConfig('employees', employees);

    return Response.json({ 
      success: true, 
      employee: newEmployee 
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    return Response.json(
      { success: false, error: 'Failed to add employee' },
      { status: 500 }
    );
  }
}

// Delete employee
export async function DELETE(req) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return Response.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const employees = await get('employees') || [];
    const employee = employees.find(e => e.id === body.id);
    
    if (employee) {
      employee.active = false;
      await updateEdgeConfig('employees', employees);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error removing employee:', error);
    return Response.json(
      { success: false, error: 'Failed to remove employee' },
      { status: 500 }
    );
  }
}
