import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react-native';
import { CATEGORIES } from '@/constants/menu-data';
import { MenuItem } from '@/types/menu';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menu-service';

export default function MenuManagementScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Starters',
    description: '',
  });

  // Subscribe to real-time menu updates
  useEffect(() => {
    const unsubscribe = getMenuItems((items) => {
      setMenuItems(items);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleAddItem = async () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const newItemData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description.trim() || undefined,
        available: true,
      };

      await addMenuItem(newItemData);
      setIsAddModalVisible(false);
      resetForm();
      Alert.alert('Success', 'Menu item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add menu item. Please try again.');
    }
  };

  const handleEditItem = async () => {
    if (!editingItem || !formData.name.trim() || !formData.price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const updates = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description.trim() || undefined,
      };

      await updateMenuItem(editingItem.id, updates);
      setEditingItem(null);
      resetForm();
      Alert.alert('Success', 'Menu item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update menu item. Please try again.');
    }
  };

  const handleDeleteItem = (item: MenuItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMenuItem(item.id);
              Alert.alert('Success', 'Menu item deleted successfully!');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete menu item. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { available: !item.available });
    } catch (error) {
      console.error('Error toggling availability:', error);
      Alert.alert('Error', 'Failed to update item availability. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Starters',
      description: '',
    });
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description || '',
    });
  };

  const closeModal = () => {
    setIsAddModalVisible(false);
    setEditingItem(null);
    resetForm();
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={[styles.menuItem, !item.available && styles.unavailableItem]}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        {item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.available ? '#38a169' : '#e53e3e' }]}
          onPress={() => handleToggleAvailability(item)}
          testID={`toggle-${item.id}`}
        >
          <Text style={styles.actionButtonText}>
            {item.available ? 'Available' : 'Unavailable'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3182ce' }]}
          onPress={() => openEditModal(item)}
          testID={`edit-${item.id}`}
        >
          <Edit size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#e53e3e' }]}
          onPress={() => handleDeleteItem(item)}
          testID={`delete-${item.id}`}
        >
          <Trash2 size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderModal = () => (
    <Modal
      visible={isAddModalVisible || editingItem !== null}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </Text>
            <TouchableOpacity onPress={closeModal} testID="close-modal">
              <X size={24} color="#718096" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Item Name *"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            testID="item-name-input"
          />

          <TextInput
            style={styles.input}
            placeholder="Price *"
            value={formData.price}
            onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
            keyboardType="numeric"
            testID="item-price-input"
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <View style={styles.categoryButtons}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.selectedCategory
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, category }))}
                  testID={`category-${category}`}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    formData.category === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description (optional)"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={3}
            testID="item-description-input"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={editingItem ? handleEditItem : handleAddItem}
            testID="save-item-button"
          >
            <Save size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Menu Management',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsAddModalVisible(true)}
              testID="add-item-button"
            >
              <Plus size={24} color="#d69e2e" />
            </TouchableOpacity>
          )
        }} 
      />
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d69e2e" />
            <Text style={styles.loadingText}>Loading menu items...</Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {renderModal()}
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableItem: {
    opacity: 0.6,
    backgroundColor: '#f7fafc',
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#d69e2e',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38a169',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#718096',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f7fafc',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategory: {
    backgroundColor: '#d69e2e',
    borderColor: '#d69e2e',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#718096',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38a169',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});