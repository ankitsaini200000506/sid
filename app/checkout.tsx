import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { CreditCard, Smartphone, QrCode } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { useCart } from '@/store/cart-store';
import { useOrders } from '@/store/order-store';

export default function CheckoutScreen() {
  const { items, total, tableNumber, setTableNumber, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'qr'>('razorpay');
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendWhatsAppNotification = async (orderId: string, total: number) => {
    try {
      const message = `New Order Alert!\n\nOrder ID: ${orderId}\nAmount: ₹${total}\nTable: ${tableNumber || 'Not specified'}\nPhone: ${customerPhone}\n\nPlease check the admin dashboard for details.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/916398059036?text=${encodedMessage}`;
      
      if (Platform.OS === 'web') {
        window.open(whatsappUrl, '_blank');
      } else {
        await Linking.openURL(whatsappUrl);
      }
    } catch (error) {
      console.log('WhatsApp notification failed:', error);
    }
  };

  const handleRazorpayPayment = async () => {
    // In a real app, you would integrate with Razorpay SDK
    // For now, we'll simulate the payment
    setIsProcessing(true);
    
    try {
      // Simulate Razorpay payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create order
      console.log('Creating order with items:', items.length, 'total:', total);
      const order = createOrder({
        items,
        total,
        status: 'received',
        paymentStatus: 'completed',
        tableNumber: tableNumber || undefined,
        customerPhone,
      });
      console.log('Order created successfully:', order.id);

      // Send WhatsApp notification
      await sendWhatsAppNotification(order.id, total);

      // Clear cart
      clearCart();

      // Navigate to order status
      router.replace(`/order-status?orderId=${order.id}`);
    } catch (error) {
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRPayment = () => {
    if (paymentMethod === 'qr') {
      setShowQR(true);
    } else {
      handleRazorpayPayment();
    }
  };

  const handlePayment = async () => {
    if (!customerPhone.trim()) {
      Alert.alert('Phone Required', 'Please enter your phone number for order updates.');
      return;
    }

    if (customerPhone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
      return;
    }

    handleQRPayment();
  };

  const confirmQRPayment = async () => {
    setIsProcessing(true);
    setShowQR(false);
    
    try {
      // Create order
      console.log('Creating QR order with items:', items.length, 'total:', total);
      const order = createOrder({
        items,
        total,
        status: 'received',
        paymentStatus: 'completed',
        tableNumber: tableNumber || undefined,
        customerPhone,
      });
      console.log('QR Order created successfully:', order.id);

      // Send WhatsApp notification
      await sendWhatsAppNotification(order.id, total);

      // Clear cart
      clearCart();

      // Navigate to order status
      router.replace(`/order-status?orderId=${order.id}`);
    } catch (error) {
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Checkout', headerBackTitle: 'Cart' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹{total}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number (for order updates)"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              maxLength={10}
              testID="phone-input"
            />
            <TextInput
              style={styles.input}
              placeholder="Table Number (optional)"
              value={tableNumber}
              onChangeText={setTableNumber}
              testID="table-input"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'razorpay' && styles.selectedPayment
              ]}
              onPress={() => setPaymentMethod('razorpay')}
              testID="razorpay-option"
            >
              <CreditCard size={24} color={paymentMethod === 'razorpay' ? '#d69e2e' : '#718096'} />
              <Text style={[
                styles.paymentText,
                paymentMethod === 'razorpay' && styles.selectedPaymentText
              ]}>
                Razorpay (Cards, UPI, Wallets)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'upi' && styles.selectedPayment
              ]}
              onPress={() => setPaymentMethod('upi')}
              testID="upi-option"
            >
              <Smartphone size={24} color={paymentMethod === 'upi' ? '#d69e2e' : '#718096'} />
              <Text style={[
                styles.paymentText,
                paymentMethod === 'upi' && styles.selectedPaymentText
              ]}>
                UPI (PhonePe, GPay, Paytm)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'qr' && styles.selectedPayment
              ]}
              onPress={() => setPaymentMethod('qr')}
              testID="qr-option"
            >
              <QrCode size={24} color={paymentMethod === 'qr' ? '#d69e2e' : '#718096'} />
              <Text style={[
                styles.paymentText,
                paymentMethod === 'qr' && styles.selectedPaymentText
              ]}>
                Scan QR to Pay
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showQR && (
          <View style={styles.qrModal}>
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Scan QR Code to Pay</Text>
              <Text style={styles.qrAmount}>₹{total}</Text>
              
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={`upi://pay?pa=merchant@upi&pn=SIDDHI Restaurant&am=${total}&cu=INR&tn=Order Payment`}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              
              <Text style={styles.qrInstructions}>
                Open any UPI app and scan this QR code to complete payment
              </Text>
              
              <View style={styles.qrButtons}>
                <TouchableOpacity
                  style={styles.qrCancelButton}
                  onPress={() => setShowQR(false)}
                >
                  <Text style={styles.qrCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.qrConfirmButton}
                  onPress={confirmQRPayment}
                  disabled={isProcessing}
                >
                  <Text style={styles.qrConfirmText}>
                    {isProcessing ? 'Processing...' : 'Payment Done'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isProcessing}
            testID="pay-button"
          >
            <Text style={styles.payButtonText}>
              {isProcessing ? 'Processing...' : paymentMethod === 'qr' ? 'Show QR Code' : `Pay ₹${total}`}
            </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
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
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#d69e2e',
    backgroundColor: '#fef5e7',
  },
  paymentText: {
    fontSize: 16,
    color: '#718096',
    marginLeft: 12,
  },
  selectedPaymentText: {
    color: '#d69e2e',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  payButton: {
    backgroundColor: '#2d3748',
    paddingVertical: 16,
    borderRadius: 12,
  },
  payButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  qrModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    maxWidth: 320,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  qrAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d69e2e',
    marginBottom: 24,
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  qrButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  qrCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrCancelText: {
    color: '#718096',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  qrConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#d69e2e',
  },
  qrConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});