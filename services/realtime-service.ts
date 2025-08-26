import { database } from '@/config/firebase';
import { ref, onValue, set, update, remove, push } from 'firebase/database';
import { MenuItem, Order, CartItem } from '@/types/menu';

// Menu Items
export const getMenuItems = (callback: (items: MenuItem[]) => void) => {
  const menuRef = ref(database, 'menu');
  return onValue(menuRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const items = Object.values(data) as MenuItem[];
      // Sort items by category for better display
      items.sort((a, b) => {
        // First sort by category
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        // Then by name within the same category
        return a.name.localeCompare(b.name);
      });
      callback(items);
    } else {
      console.log('No menu items found in database');
      callback([]);
    }
  }, (error) => {
    console.error('Error fetching menu items:', error);
    callback([]);
  });
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  const menuRef = ref(database, 'menu');
  const newItemRef = push(menuRef);
  const newItem = { ...item, id: newItemRef.key };
  await set(newItemRef, newItem);
  return newItem;
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
  const itemRef = ref(database, `menu/${id}`);
  await update(itemRef, item);
};

export const deleteMenuItem = async (id: string) => {
  const itemRef = ref(database, `menu/${id}`);
  await remove(itemRef);
};

// Orders
export const getOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(database, 'orders');
  return onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    const orders = data ? Object.values(data) : [];
    callback(orders as Order[]);
  });
};

export const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
  const ordersRef = ref(database, 'orders');
  const newOrderRef = push(ordersRef);
  const newOrder = {
    ...order,
    id: newOrderRef.key as string,
    timestamp: new Date().toISOString(),
  };
  await set(newOrderRef, newOrder);
  return newOrder;
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const orderRef = ref(database, `orders/${id}`);
  await update(orderRef, { status });
};

export const getOrderById = (id: string, callback: (order: Order | null) => void) => {
  const orderRef = ref(database, `orders/${id}`);
  return onValue(orderRef, (snapshot) => {
    const data = snapshot.val();
    callback(data as Order | null);
  });
};

// Initialize database with default menu items if empty
export const initializeDatabase = async (defaultMenuItems: MenuItem[]) => {
  const menuRef = ref(database, 'menu');
  onValue(menuRef, (snapshot) => {
    if (!snapshot.exists()) {
      const menuData = {};
      defaultMenuItems.forEach(item => {
        menuData[item.id] = item;
      });
      set(menuRef, menuData);
    }
  }, { onlyOnce: true });
};