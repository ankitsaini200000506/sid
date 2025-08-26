import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types/menu';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/config/firebase';

export const [CartProvider, useCart] = createContextHook(() => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [cartId, setCartId] = useState<string>(() => `cart_${Date.now()}`);
  
  // Sync with Firebase
  useEffect(() => {
    const cartRef = ref(database, `carts/${cartId}`);
    
    // Initial load and real-time updates
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItems(data.items || []);
        setTableNumber(data.tableNumber || '');
      }
    });
    
    return () => unsubscribe();
  }, [cartId]);

  const addToCart = useCallback((menuItem: MenuItem) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === menuItem.id);
      const newItems = existingItem
        ? prev.map(item =>
            item.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...menuItem, quantity: 1 }];
      
      // Update Firebase
      const cartRef = ref(database, `carts/${cartId}`);
      set(cartRef, { items: newItems, tableNumber })
        .then(() => console.log('Cart updated successfully'))
        .catch(error => console.error('Error updating cart:', error));
      
      return newItems;
    });
  }, [cartId, tableNumber]);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId);
      
      // Update Firebase
      const cartRef = ref(database, `carts/${cartId}`);
      set(cartRef, { items: newItems, tableNumber });
      
      return newItems;
    });
  }, [cartId, tableNumber]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(prev => {
      const newItems = prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      // Update Firebase
      const cartRef = ref(database, `carts/${cartId}`);
      set(cartRef, { items: newItems, tableNumber });
      
      return newItems;
    });
  }, [removeFromCart, cartId, tableNumber]);

  const clearCart = useCallback(() => {
    setItems([]);
    
    // Update Firebase
    const cartRef = ref(database, `carts/${cartId}`);
    set(cartRef, { items: [], tableNumber });
  }, [cartId, tableNumber]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Update Firebase when table number changes
  useEffect(() => {
    const cartRef = ref(database, `carts/${cartId}`);
    set(cartRef, { items, tableNumber });
  }, [tableNumber, cartId]);
  
  return {
    items,
    total,
    itemCount,
    tableNumber,
    cartId,
    setTableNumber,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
});