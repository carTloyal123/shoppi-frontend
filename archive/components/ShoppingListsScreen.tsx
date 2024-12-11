import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { ShoppingListItem } from '../components/ShoppingListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
  isShared: boolean;
}

const sampleLists: ShoppingList[] = [
  { id: '1', name: 'Groceries', itemCount: 12, isShared: true },
  { id: '2', name: 'Birthday Party', itemCount: 8, isShared: false },
  { id: '3', name: 'Home Improvement', itemCount: 5, isShared: true },
  { id: '4', name: 'Camping Trip', itemCount: 15, isShared: false },
];

type ShoppingListsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShoppingLists'>;

export const ShoppingListsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<ShoppingListsScreenNavigationProp>();

  const handleListPress = (listId: string) => {
    navigation.navigate('ShoppingListDetails', { listId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Shopping Lists</Text>
      <ScrollView style={styles.listContainer}>
        {sampleLists.map((list) => (
          <TouchableOpacity key={list.id} onPress={() => handleListPress(list.id)}>
            <ShoppingListItem
              name={list.name}
              itemCount={list.itemCount}
              isShared={list.isShared}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={() => console.log('Create new list')}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create New List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

