import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect } from 'react';
import { Order } from '@/types/menu';
import { ref, onValue, set, update, push } from 'firebase/database';
import { database } from '@/config/firebase';

export const [OrderProvider, useOrders] = createContextHook(() => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Sync with Firebase
  useEffect(() => {
    try {
      const ordersRef = ref(database, 'orders');
      
      // Initial load and real-time updates
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const ordersList = Object.values(data) as Order[];
          // Sort by timestamp (newest first)
          ordersList.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return dateB.getTime() - dateA.getTime();
          });
          setOrders(ordersList);
        } else {
          setOrders([]);
        }
      }, (error) => {
        console.error('Error fetching orders from Firebase:', error);
        // Keep existing orders in local state if Firebase fails
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase connection failed for orders:', error);
      // Keep existing orders in local state
      return () => {};
    }
  }, []);

  const createOrder = useCallback((order: Omit<Order, 'id' | 'timestamp'>) => {
    const orderId = `ORD${Date.now()}`;
    
    const newOrder: Order = {
      ...order,
      id: orderId,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const ordersRef = ref(database, 'orders');
      const newOrderRef = push(ordersRef);
      
      // Save to Firebase
      set(newOrderRef, newOrder)
        .then(() => console.log('Order created successfully:', orderId))
        .catch(error => {
          console.error('Error creating order in Firebase:', error);
          // If Firebase fails, still add to local state
          setOrders(prev => [newOrder, ...prev]);
          console.log('Order added to local state due to Firebase error:', newOrder.id);
        });
    } catch (error) {
      console.error('Firebase connection failed, adding order to local state:', error);
      // If Firebase is completely unavailable, add to local state
      setOrders(prev => [newOrder, ...prev]);
      console.log('Order added to local state due to Firebase connection failure:', newOrder.id);
    }
    
    setCurrentOrder(newOrder);
    console.log('Order added to current order:', newOrder.id);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    try {
      // Update in Firebase
      const orderRef = ref(database, `orders/${orderId}`);
      update(orderRef, { status })
        .catch(error => {
          console.error('Error updating order status in Firebase:', error);
        });
    } catch (error) {
      console.error('Firebase connection failed for status update:', error);
    }
    
    // Always update local state for immediate UI response
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    
    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  }, [currentOrder]);

  const getOrderById = useCallback((orderId: string, callback?: (order: Order | null) => void) => {
    // Set up a listener for real-time updates
    const orderRef = ref(database, `orders/${orderId}`);
    const unsubscribe = onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert timestamp string to Date if needed for UI
        const order = data as Order;
        setCurrentOrder(order);
        if (callback) callback(order);
      } else {
        setCurrentOrder(null);
        if (callback) callback(null);
      }
    });
    
    return unsubscribe;
  }, [currentOrder]);

  return {
    orders,
    currentOrder,
    setCurrentOrder,
    createOrder,
    updateOrderStatus,
    getOrderById,
  };
});