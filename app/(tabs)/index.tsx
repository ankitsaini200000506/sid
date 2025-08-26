import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/store/cart-store';
import { Menu } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const { itemCount, total } = useCart();

  const handleViewMenu = () => {
    router.push('/menu');
  };

  const handleOrderStatus = () => {
    router.push('/order-status');
  };

  const handleAdminLogin = () => {
    router.push('/admin');
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SIDDHI</Text>
        <TouchableOpacity style={styles.menuIcon}>
          <Menu size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoText}>SIDDHI</Text>
              <Text style={styles.logoTagline}>BITE INTO HAPPINESS</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.welcomeTitle}>Welcome to SIDDHI</Text>
        <Text style={styles.description}>Experience the fresh taste of happiness</Text>

        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.viewMenuButton}
          onPress={handleViewMenu}
          testID="view-menu-button"
        >
          <Text style={styles.viewMenuButtonText}>View Menu</Text>
        </TouchableOpacity>

        {/* Secondary Buttons */}
        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleOrderStatus}
          >
            <Text style={styles.secondaryButtonText}>Order Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleAdminLogin}
          >
            <Text style={styles.secondaryButtonText}>Admin Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Cart Section */}
      {itemCount > 0 && (
        <View style={styles.cartSection}>
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
            <View style={styles.cartDetails}>
              <Text style={styles.cartPrice}>₹{total.toFixed(2)}</Text>
              <Text style={styles.cartLabel}>View cart</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={handleViewCart}
          >
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#f3f3f3',
    marginTop: 6,
    opacity: 0.9,
  },
  menuIcon: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoIconContainerPurple: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#1a1a1a',
  },
  emoji: {
    fontSize: 48,
  },
  logoTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoTagline: {
    color: '#fff',
    fontSize: 8,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  viewMenuButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 30,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  viewMenuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  secondaryButton: {
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 0.45,
  },
  secondaryButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  cartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: '#d4af37',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartBadgeText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartDetails: {
    flexDirection: 'column',
  },
  cartPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartLabel: {
    color: '#ccc',
    fontSize: 12,
  },
  viewCartButton: {
    backgroundColor: '#f5f5f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewCartButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '600',
  },
});