import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { CATEGORIES, MENU_DATA } from '@/constants/menu-data';
import MenuItem from '@/components/MenuItem';
import CategoryFilter from '@/components/CategoryFilter';
import { getMenuItems, initializeMenuData, getLocalMenuItems } from '@/services/menu-service';
import { MenuItem as MenuItemType } from '@/types/menu';

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Subscribe to real-time menu updates
  useEffect(() => {
    // Initialize menu data if needed
    const initializeData = async () => {
      try {
        await initializeMenuData();
        console.log('Menu data initialization check completed');
      } catch (error) {
        console.error('Error initializing menu data:', error);
        // If initialization fails, use local data immediately
        const localItems = getLocalMenuItems();
        setMenuItems(localItems);
        setLoading(false);
      }
    };
    
    initializeData();
    
    // Subscribe to real-time updates
    const unsubscribe = getMenuItems((items) => {
      console.log('Received menu items:', items.length);
      setMenuItems(items);
      setLoading(false);
    });
    
    // Set a timeout to stop loading if no data comes within 3 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, using local data');
        const localItems = getLocalMenuItems();
        setMenuItems(localItems);
        setLoading(false);
      }
    }, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const filteredItems = useMemo(() => {
    let items = menuItems.filter(item => item.available);
    console.log('Total menu items:', menuItems.length, 'Available items:', items.length);

    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
      console.log('Items after category filter:', items.length);
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('Items after search filter:', items.length);
    }

    return items;
  }, [searchQuery, selectedCategory, menuItems]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Menu</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#718096" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food, coffee, etc..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="search-input"
          />
        </View>
      </View>

      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d69e2e" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      ) : null}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2d3748',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#718096',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
});