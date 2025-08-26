export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber?: string;
  items: CartItem[];
  total: number;
  status: 'received' | 'preparing' | 'ready' | 'completed';
  timestamp: string | Date;
  paymentStatus: 'pending' | 'completed' | 'failed';
  customerPhone?: string;
}

export type MenuCategory = 'Starters' | 'Fast Food' | 'Breakfast' | 'Chaat' | 'Burger/Pizza' | 'South Indian' | 'Hot & Cold';