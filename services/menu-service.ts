import { database } from '@/config/firebase';
import { ref, onValue, set, update, remove, push } from 'firebase/database';
import { MenuItem, MenuCategory } from '@/types/menu';
import { MENU_DATA, CATEGORIES } from '@/constants/menu-data';

// Initialize database with default menu items
export const initializeMenuData = async () => {
  try {
    const menuRef = ref(database, 'menu');
    
    // Check if menu data already exists
    return new Promise<void>((resolve) => {
      onValue(menuRef, (snapshot) => {
        if (!snapshot.exists()) {
          // Convert array to object with IDs as keys
          const menuData: Record<string, MenuItem> = {};
          MENU_DATA.forEach(item => {
            menuData[item.id] = item;
          });
          
          // Set the data
          set(menuRef, menuData)
            .then(() => console.log('Menu data initialized successfully'))
            .catch(error => {
              console.error('Error initializing menu data in Firebase:', error);
              console.log('Will use local data instead');
            });
        } else {
          console.log('Menu data already exists, skipping initialization');
        }
        resolve();
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error('Firebase connection failed during initialization:', error);
    console.log('Will use local data instead');
    return Promise.resolve();
  }
};

// Get all menu items with real-time updates
export const getMenuItems = (callback: (items: MenuItem[]) => void) => {
  try {
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
        console.log('No menu items found in database, using local data');
        // Fallback to local data if Firebase is empty
        callback(MENU_DATA);
      }
    }, (error) => {
      console.error('Error fetching menu items from Firebase, using local data:', error);
      // Fallback to local data if Firebase fails
      callback(MENU_DATA);
    });
  } catch (error) {
    console.error('Firebase connection failed, using local data:', error);
    // Immediate fallback to local data if Firebase is not available
    callback(MENU_DATA);
    return () => {}; // Return empty unsubscribe function
  }
};

// Get menu items by category
export const getMenuItemsByCategory = (category: string, callback: (items: MenuItem[]) => void) => {
  getMenuItems((items) => {
    const filteredItems = items.filter(item => item.category === category);
    // Sort by name within category
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    callback(filteredItems);
  });
};

// Add a new menu item
export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  const menuRef = ref(database, 'menu');
  const newItemRef = push(menuRef);
  const newItem = { ...item, id: newItemRef.key as string };
  
  try {
    await set(newItemRef, newItem);
    console.log('Menu item added successfully:', newItem.name);
    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

// Update an existing menu item
export const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
  const itemRef = ref(database, `menu/${id}`);
  
  try {
    await update(itemRef, item);
    console.log('Menu item updated successfully:', id);
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string) => {
  const itemRef = ref(database, `menu/${id}`);
  
  try {
    await remove(itemRef);
    console.log('Menu item deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// Get all categories
export const getCategories = (): MenuCategory[] => {
  return CATEGORIES as MenuCategory[];
};

// Get menu items directly from local data (fallback function)
export const getLocalMenuItems = (): MenuItem[] => {
  return MENU_DATA;
};

// Remove duplicate declarations that were causing errors
// export const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
//   const itemRef = ref(database, `menu/${id}`);
//   await update(itemRef, updates);
// };

// export const deleteMenuItem = async (id: string) => {
//   const itemRef = ref(database, `menu/${id}`);
//   await remove(itemRef);
// };