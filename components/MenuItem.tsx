import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useCart } from '@/store/cart-store';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  // Default image if none provided
  const defaultImage = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop';
  
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || defaultImage }}
            style={styles.image}
          />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          )}
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddToCart}
        testID={`add-to-cart-${item.id}`}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexWrap: 'wrap',
    minHeight: 100,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    minWidth: 0,
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    width: 100,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    marginLeft: 'auto',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});