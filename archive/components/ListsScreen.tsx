import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/app/(tabs)/ListOverviews';

type ListsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Lists'>;

interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
  sharedWith: number;
}

const mockLists: ShoppingList[] = [
  { id: '1', name: 'Family Groceries', itemCount: 3, sharedWith: 2 },
  { id: '2', name: 'Weekend BBQ', itemCount: 3, sharedWith: 2 },
  { id: '3', name: 'Office Supplies', itemCount: 5, sharedWith: 3 },
];

export default function ListsScreen() {
  const navigation = useNavigation<ListsScreenNavigationProp>();

  const renderItem = ({ item }: { item: ShoppingList }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.listItemName}>{item.name}</Text>
        <Text style={styles.listItemDetails}>
          {item.itemCount} items • Shared with {item.sharedWith}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockLists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.fab} onPress={() => console.log('Create new list')}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

