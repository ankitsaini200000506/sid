import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { LogOut, Settings, Clock, ChefHat, Package, CheckCircle, QrCode } from 'lucide-react-native';
import { useOrders } from '@/store/order-store';
import { useAdmin } from '@/store/admin-store';
import { Order } from '@/types/menu';

export default function AdminDashboardScreen() {
  const { orders, updateOrderStatus, createOrder } = useOrders();
  const { logout, adminUser } = useAdmin();
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [newOrderNotification, setNewOrderNotification] = useState<string | null>(null);
  
  useEffect(() => {
    // When orders are loaded, set loading to false
    if (orders.length > 0 || orders.length === 0) {
      setLoading(false);
    }
  }, [orders]);

  // Show notification for new orders
  useEffect(() => {
    console.log('Admin dashboard received orders update:', orders.length, 'orders');
    if (orders.length > 0) {
      const latestOrder = orders[0]; // Orders are sorted newest first
      console.log('Latest order:', latestOrder.id, 'status:', latestOrder.status, 'timestamp:', latestOrder.timestamp);
      const orderTime = new Date(latestOrder.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - orderTime.getTime();
      
      // Show notification for orders created in the last 30 seconds
      if (timeDiff < 30000) {
        console.log('Showing notification for new order:', latestOrder.id);
        setNewOrderNotification(`New order #${latestOrder.id} received!`);
        
        // Play notification sound (if available)
        if (typeof window !== 'undefined' && window.Audio) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.5;
            audio.play().catch(() => {
              // Ignore audio play errors
            });
          } catch (error) {
            // Ignore audio errors
          }
        }
        
        setTimeout(() => setNewOrderNotification(null), 5000); // Hide after 5 seconds
      }
    }
  }, [orders]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          logout();
          router.replace('/admin');
        }},
      ]
    );
  };

  const addTestOrder = () => {
    const testOrder = createOrder({
      items: [{ id: '1', name: 'Test Item', price: 100, quantity: 1, category: 'Test', available: true }],
      total: 100,
      status: 'received',
      paymentStatus: 'completed',
      tableNumber: 'TEST',
      customerPhone: '1234567890'
    });
    console.log('Test order added:', testOrder.id);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusIcon = (status: Order['status']) => {
    const size = 20;
    const color = '#718096';

    switch (status) {
      case 'received':
        return <Clock size={size} color={color} />;
      case 'preparing':
        return <ChefHat size={size} color={color} />;
      case 'ready':
        return <Package size={size} color={color} />;
      case 'completed':
        return <CheckCircle size={size} color={color} />;
      default:
        return <Clock size={size} color={color} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return '#3182ce';
      case 'preparing':
        return '#d69e2e';
      case 'ready':
        return '#38a169';
      case 'completed':
        return '#718096';
      default:
        return '#718096';
    }
  };

  const renderOrderItem = ({ item: order }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          {getStatusIcon(order.status)}
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderTime}>
          {order.timestamp.toLocaleString()}
        </Text>
        {order.tableNumber && (
          <Text style={styles.tableNumber}>Table: {order.tableNumber}</Text>
        )}
        <Text style={styles.orderTotal}>Total: ₹{order.total}</Text>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item) => (
          <Text key={item.id} style={styles.orderItem}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <View style={styles.statusButtons}>
        {order.status === 'received' && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#d69e2e' }]}
            onPress={() => handleStatusUpdate(order.id, 'preparing')}
            testID={`prepare-${order.id}`}
          >
            <Text style={styles.statusButtonText}>Start Preparing</Text>
          </TouchableOpacity>
        )}
        {order.status === 'preparing' && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#38a169' }]}
            onPress={() => handleStatusUpdate(order.id, 'ready')}
            testID={`ready-${order.id}`}
          >
            <Text style={styles.statusButtonText}>Mark Ready</Text>
          </TouchableOpacity>
        )}
        {order.status === 'ready' && (
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#718096' }]}
            onPress={() => handleStatusUpdate(order.id, 'completed')}
            testID={`complete-${order.id}`}
          >
            <Text style={styles.statusButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Admin Dashboard',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => router.push('/menu-management')}
                style={[styles.headerButton, { marginRight: 10 }]}
                testID="menu-management-button"
              >
                <Settings size={24} color="#4a5568" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/qr-generator')}
                style={[styles.headerButton, { marginRight: 10 }]}
                testID="qr-generator-button"
              >
                <QrCode size={24} color="#4a5568" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.headerButton}
                testID="logout-button"
              >
                <LogOut size={24} color="#e53e3e" />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d69e2e" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : (
        <>
          {newOrderNotification && (
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationText}>{newOrderNotification}</Text>
            </View>
          )}
                  <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome, {adminUser}</Text>
            {orders.filter(order => order.status === 'received').length > 0 && (
              <View style={styles.newOrdersBadge}>
                <Text style={styles.newOrdersText}>
                  {orders.filter(order => order.status === 'received').length} new
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.qrGeneratorButton}
              onPress={() => router.push('/qr-generator')}
              testID="qr-generator-button"
            >
              <QrCode size={20} color="#d69e2e" />
              <Text style={styles.qrGeneratorText}>QR Codes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuManagementButton}
              onPress={() => router.push('/menu-management')}
              testID="menu-management-button"
            >
              <Settings size={20} color="#fff" />
              <Text style={styles.menuManagementText}>Menu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.testOrderButton}
              onPress={addTestOrder}
              testID="test-order-button"
            >
              <Text style={styles.testOrderText}>Test Order</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter Orders:</Text>
          <View style={styles.filterButtons}>
            {(['all', 'received', 'preparing', 'ready', 'completed'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  selectedStatus === status && styles.selectedFilter
                ]}
                onPress={() => setSelectedStatus(status)}
                testID={`filter-${status}`}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.selectedFilterText
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
        </>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a5568',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 4,
  },
  qrGeneratorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef5e7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d69e2e',
  },
  qrGeneratorText: {
    color: '#d69e2e',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  menuManagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d69e2e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  menuManagementText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedFilter: {
    backgroundColor: '#d69e2e',
    borderColor: '#d69e2e',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#718096',
  },
  selectedFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderTime: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 14,
    color: '#d69e2e',
    fontWeight: '600',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 2,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
  },
  notificationContainer: {
    backgroundColor: '#38a169',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  newOrdersBadge: {
    backgroundColor: '#e53e3e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  newOrdersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  testOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53e3e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  testOrderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});