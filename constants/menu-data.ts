import { MenuItem } from '@/types/menu';

export const MENU_DATA: MenuItem[] = [
  // Starters
  { id: '1', name: 'Paneer Tikka', price: 200, category: 'Starters', description: 'Grilled cottage cheese with spices', available: true },
  { id: '2', name: 'Paneer Malai Tikka', price: 220, category: 'Starters', description: 'Creamy cottage cheese tikka', available: true },
  { id: '3', name: 'Paneer Afghani Tikka', price: 200, category: 'Starters', description: 'Afghani style cottage cheese', available: true },
  { id: '4', name: 'Tandoori Tea', price: 160, category: 'Starters', description: 'Special tandoori flavored tea', available: true },
  { id: '5', name: 'Afghani Chaap Tikka', price: 160, category: 'Starters', description: 'Afghani style soya chaap', available: true },
  { id: '6', name: 'Tandoori Momos (8pcs)', price: 160, category: 'Starters', description: 'Tandoori style momos', available: true },
  { id: '7', name: 'Tandoori Platter', price: 280, category: 'Starters', description: 'Mixed tandoori items', available: true },
  { id: '8', name: 'Malai Chaap', price: 180, category: 'Starters', description: 'Creamy soya chaap', available: true },
  { id: '9', name: 'Mushroom Tikka', price: 200, category: 'Starters', description: 'Grilled mushroom with spices', available: true },

  // Fast Food
  { id: '10', name: 'French Fries', price: 60, category: 'Fast Food', description: 'Crispy golden fries', available: true },
  { id: '11', name: 'Pizza Potato', price: 60, category: 'Fast Food', description: 'Pizza flavored potato', available: true },
  { id: '12', name: 'Sweet Chilli Potato', price: 70, category: 'Fast Food', description: 'Sweet and spicy potato', available: true },
  { id: '13', name: 'Delhi Paneer Dry', price: 100, category: 'Fast Food', description: 'Dry paneer Delhi style', available: true },
  { id: '14', name: 'Delhi Paneer Gravy', price: 120, category: 'Fast Food', description: 'Paneer in rich gravy', available: true },
  { id: '15', name: 'Manchurian Dry (5pcs)', price: 60, category: 'Fast Food', description: 'Dry manchurian balls', available: true },
  { id: '16', name: 'Spring Roll', price: 80, category: 'Fast Food', description: 'Crispy vegetable spring rolls', available: true },
  { id: '17', name: 'Momos Steamed (Full)', price: 70, category: 'Fast Food', description: 'Steamed momos full plate', available: true },
  { id: '18', name: 'Momos Steamed (Half)', price: 40, category: 'Fast Food', description: 'Steamed momos half plate', available: true },
  { id: '19', name: 'Momos Fried (Full)', price: 90, category: 'Fast Food', description: 'Fried momos full plate', available: true },
  { id: '20', name: 'Momos Fried (Half)', price: 50, category: 'Fast Food', description: 'Fried momos half plate', available: true },
  { id: '21', name: 'Chowmein', price: 50, category: 'Fast Food', description: 'Classic vegetable chowmein', available: true },
  { id: '22', name: 'Double Chowmein', price: 70, category: 'Fast Food', description: 'Double portion chowmein', available: true },
  { id: '23', name: 'Schezwan Chowmein', price: 80, category: 'Fast Food', description: 'Spicy schezwan chowmein', available: true },
  { id: '24', name: 'Pav Bhaji', price: 60, category: 'Fast Food', description: 'Mumbai style pav bhaji', available: true },
  { id: '25', name: 'Extra Pav', price: 20, category: 'Fast Food', description: 'Additional pav bread', available: true },
  { id: '26', name: 'Pasta (Red Sauce)', price: 80, category: 'Fast Food', description: 'Pasta in tomato sauce', available: true },
  { id: '27', name: 'Pasta (White Sauce)', price: 100, category: 'Fast Food', description: 'Pasta in white sauce', available: true },

  // Breakfast
  { id: '28', name: 'Chole Bhature (Full)', price: 50, category: 'Breakfast', description: 'Full plate chole bhature', available: true },
  { id: '29', name: 'Chole Bhature (Half)', price: 30, category: 'Breakfast', description: 'Half plate chole bhature', available: true },

  // Chaat
  { id: '30', name: 'Samosa', price: 15, category: 'Chaat', description: 'Crispy samosa', available: true },
  { id: '31', name: 'Tikki', price: 25, category: 'Chaat', description: 'Aloo tikki', available: true },
  { id: '32', name: 'Bhalla Papdi', price: 50, category: 'Chaat', description: 'Delhi style bhalla papdi', available: true },
  { id: '33', name: 'Golgappa with Water (5pcs)', price: 25, category: 'Chaat', description: 'Golgappa with spicy water', available: true },
  { id: '34', name: 'Golgappa with Curd (5pcs)', price: 35, category: 'Chaat', description: 'Golgappa with sweet curd', available: true },
  { id: '35', name: 'Raj Kachori', price: 60, category: 'Chaat', description: 'King size kachori', available: true },

  // Burger/Pizza
  { id: '36', name: 'Plain Burger', price: 40, category: 'Burger/Pizza', description: 'Simple veg burger', available: true },
  { id: '37', name: 'Cheese Burger', price: 60, category: 'Burger/Pizza', description: 'Burger with cheese', available: true },
  { id: '38', name: 'Pizza (Small)', price: 80, category: 'Burger/Pizza', description: 'Small size pizza', available: true },
  { id: '39', name: 'Pizza (Medium)', price: 150, category: 'Burger/Pizza', description: 'Medium size pizza', available: true },

  // South Indian
  { id: '40', name: 'Plain Dosa', price: 60, category: 'South Indian', description: 'Classic plain dosa', available: true },
  { id: '41', name: 'Masala Dosa', price: 70, category: 'South Indian', description: 'Dosa with potato filling', available: true },
  { id: '42', name: 'Paneer Dosa', price: 100, category: 'South Indian', description: 'Dosa with paneer filling', available: true },

  // Hot & Cold
  { id: '43', name: 'Tea', price: 20, category: 'Hot & Cold', description: 'Fresh brewed tea', available: true },
  { id: '44', name: 'Lassi (Seasonal)', price: 40, category: 'Hot & Cold', description: 'Seasonal fresh lassi', available: true },
  { id: '45', name: 'Coffee (Seasonal)', price: 25, category: 'Hot & Cold', description: 'Seasonal coffee', available: true },
  { id: '46', name: 'Cold Drinks', price: 25, category: 'Hot & Cold', description: 'Assorted cold drinks', available: true },
  { id: '47', name: 'Mineral Water', price: 20, category: 'Hot & Cold', description: 'Packaged drinking water', available: true },
];

export const CATEGORIES = ['Starters', 'Fast Food', 'Breakfast', 'Chaat', 'Burger/Pizza', 'South Indian', 'Hot & Cold'];