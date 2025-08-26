import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { CheckCircle, Clock, ChefHat, Package } from 'lucide-react-native';
import { useOrders } from '@/store/order-store';
import { Order } from '@/types/menu';

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      // Subscribe to real-time order updates
      const unsubscribe = getOrderById(orderId, (updatedOrder) => {
        setOrder(updatedOrder);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Order Status' }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d69e2e" />
            <Text style={styles.loadingText}>Loading order status...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Stack.Screen options={{ title: 'Order Status' }} />
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Order not found</Text>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.homeButtonText}>Go Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const getStatusIcon = (status: Order['status'], isActive: boolean) => {
    const color = isActive ? '#d69e2e' : '#cbd5e0';
    const size = 24;

    switch (status) {
      case 'received':
        return <CheckCircle size={size} color={color} />;
      case 'preparing':
        return <ChefHat size={size} color={color} />;
      case 'ready':
        return <Package size={size} color={color} />;
      default:
        return <Clock size={size} color={color} />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return 'Order Received';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const statusSteps = ['received', 'preparing', 'ready', 'completed'] as const;
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <>
      <Stack.Screen options={{ title: 'Order Status' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderTime}>
              {new Date(order.timestamp).toLocaleTimeString()}
            </Text>
            {order.tableNumber && (
              <Text style={styles.tableNumber}>Table: {order.tableNumber}</Text>
            )}
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.sectionTitle}>Order Progress</Text>
            
            <View style={styles.progressContainer}>
              {statusSteps.map((status, index) => {
                const isActive = index <= currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <View key={status} style={styles.statusStep}>
                    <View style={styles.statusIconContainer}>
                      <View style={[
                        styles.statusIcon,
                        isActive && styles.statusIconActive,
                        isCompleted && styles.statusIconCompleted
                      ]}>
                        {getStatusIcon(status, isActive)}
                      </View>
                      {index < statusSteps.length - 1 && (
                        <View style={[
                          styles.statusLine,
                          isCompleted && styles.statusLineCompleted
                        ]} />
                      )}
                    </View>
                    <Text style={[
                      styles.statusText,
                      isActive && styles.statusTextActive
                    ]}>
                      {getStatusText(status)}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.currentStatusContainer}>
              <Text style={styles.currentStatusLabel}>Current Status:</Text>
              <Text style={styles.currentStatus}>{getStatusText(order.status)}</Text>
            </View>
          </View>

          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalAmount}>₹{order.total}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/')}
            testID="home-button"
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#e53e3e',
    marginBottom: 24,
  },
  orderHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 16,
    color: '#d69e2e',
    fontWeight: '600',
  },
  statusContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  statusIconActive: {
    backgroundColor: '#fef5e7',
    borderColor: '#d69e2e',
  },
  statusIconCompleted: {
    backgroundColor: '#d69e2e',
    borderColor: '#d69e2e',
  },
  statusLine: {
    width: 2,
    height: 32,
    backgroundColor: '#e2e8f0',
    marginTop: 8,
  },
  statusLineCompleted: {
    backgroundColor: '#d69e2e',
  },
  statusText: {
    fontSize: 16,
    color: '#718096',
  },
  statusTextActive: {
    color: '#2d3748',
    fontWeight: '600',
  },
  currentStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fef5e7',
    borderRadius: 8,
  },
  currentStatusLabel: {
    fontSize: 16,
    color: '#2d3748',
    marginRight: 8,
  },
  currentStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d69e2e',
  },
  orderSummary: {
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
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#718096',
    marginHorizontal: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d69e2e',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d69e2e',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  homeButton: {
    backgroundColor: '#2d3748',
    paddingVertical: 16,
    borderRadius: 12,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});