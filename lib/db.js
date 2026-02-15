import { get } from '@vercel/edge-config';

// Since Edge Config is read-only from the edge, we'll use a hybrid approach:
// - Edge Config for reading (super fast)
// - API routes with in-memory cache for writing
// - Manual sync to Edge Config when needed

// Helper to get data from Edge Config with fallback
async function getFromEdge(key, fallback = null) {
  try {
    const data = await get(key);
    return data || fallback;
  } catch (error) {
    console.error(`Error reading ${key} from Edge Config:`, error);
    return fallback;
  }
}

// Initialize default data structure
export function getDefaultData() {
  return {
    orders: [],
    employees: [
      { id: 1, name: 'Arun', role: 'engraver', active: true },
      { id: 2, name: 'Sreerag', role: 'engraver', active: true },
      { id: 3, name: 'Rahul', role: 'engraver', active: true },
    ],
    productTypes: [
      { id: 1, name: 'Keychain', active: true },
      { id: 2, name: 'Photo Frame', active: true },
      { id: 3, name: 'Wall Art', active: true },
      { id: 4, name: 'Custom', active: true },
    ],
    processingLogs: [],
  };
}

// Get employees by role
export async function getEmployees(role = null) {
  try {
    const employees = await getFromEdge('employees', getDefaultData().employees);
    if (role) {
      return employees.filter(e => e.role === role && e.active);
    }
    return employees.filter(e => e.active);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return getDefaultData().employees.filter(e => e.active);
  }
}

// Get product types
export async function getProductTypes() {
  try {
    const productTypes = await getFromEdge('productTypes', getDefaultData().productTypes);
    return productTypes.filter(pt => pt.active);
  } catch (error) {
    console.error('Error fetching product types:', error);
    return getDefaultData().productTypes.filter(pt => pt.active);
  }
}

// Get all orders
export async function getAllOrders() {
  try {
    const orders = await getFromEdge('orders', []);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Get single order
export async function getOrder(uid) {
  try {
    const orders = await getFromEdge('orders', []);
    return orders.find(o => o.uid === uid) || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Get analytics
export async function getAnalytics(period = 'week') {
  try {
    const orders = await getFromEdge('orders', []);
    const now = new Date();
    let cutoffDate;

    if (period === 'day') {
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (period === 'week') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      cutoffDate = new Date(0); // All time
    }

    const completedOrders = orders.filter(o => 
      o.status === 'completed' && 
      o.completedAt && 
      new Date(o.completedAt) >= cutoffDate
    );

    const teamStats = {};
    completedOrders.forEach(order => {
      if (!order.teamMember) return;

      if (!teamStats[order.teamMember]) {
        teamStats[order.teamMember] = {
          name: order.teamMember,
          completed_orders: 0,
          totalMinutes: 0,
          orders: []
        };
      }

      if (order.claimedAt && order.completedAt) {
        const duration = Math.round(
          (new Date(order.completedAt) - new Date(order.claimedAt)) / 60000
        );
        teamStats[order.teamMember].completed_orders++;
        teamStats[order.teamMember].totalMinutes += duration;
        teamStats[order.teamMember].orders.push(duration);
      }
    });

    const teamStatsArray = Object.values(teamStats).map(stat => ({
      name: stat.name,
      completed_orders: stat.completed_orders,
      avg_processing_minutes: stat.orders.length > 0 
        ? Math.round(stat.totalMinutes / stat.orders.length) 
        : 0
    }));

    return { teamStats: teamStatsArray };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { teamStats: [] };
  }
}

// Get completed orders
export async function getCompletedOrders(limit = 50) {
  try {
    const orders = await getFromEdge('orders', []);
    const completed = orders
      .filter(o => o.status === 'completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit);

    return completed.map(order => ({
      ...order,
      processing_minutes: order.claimedAt && order.completedAt
        ? Math.round((new Date(order.completedAt) - new Date(order.claimedAt)) / 60000)
        : 0
    }));
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    return [];
  }
}

// Get processing logs
export async function getProcessingLogs() {
  try {
    const logs = await getFromEdge('processingLogs', []);
    return logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}
