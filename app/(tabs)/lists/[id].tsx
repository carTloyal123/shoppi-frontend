import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../src/theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingListItemView } from '../../../src/components/ShoppingListItemView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AddItemModal } from '../../../src/components/AddItemModal';
import { addItem, fetchListItems, fetchShoppingListById } from '@/utils/supabase/service';
import { ListItem, ShoppingList } from '@/utils/supabase/service';

export default function ShoppingListDetailsScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [listItems, setlistItems] = useState<ListItem[]>([]);
  const [listDetails, setListDetails] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        // Simulating an API call
        const newListItems = await fetchListItems(Number(id));
        const listDetails = await fetchShoppingListById(Number(id));
        setlistItems(newListItems);
        setListDetails(listDetails);
      } catch (error) {
        console.error('Error fetching list details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [id]);

  const handleAddItem = async (newItem: ListItem) => {
    console.log('Adding item:', newItem);
    // add item to db
    const addedItem = await addItem(Number(id), newItem.item_name);
    if (addedItem) {
      console.log('Added item to DB!:', addedItem);
      const updatedItems = [
        ...listItems,
        { ...addedItem },
      ];
      console.log('Updated items:', updatedItems);
      setlistItems(updatedItems);
    } else {
      console.error('Error adding item:', newItem);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Feather name="home" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{listDetails?.list_name}</Text>
      <ScrollView style={styles.itemList}>
        {listItems.map((item) => (
          <ShoppingListItemView
            key={item.item_id}
            name={item.item_name}
            type={"Other"}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
      <AddItemModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddItem={handleAddItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  homeButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemList: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemType: {
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

