import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../ListOverviews';
import { Ionicons } from '@expo/vector-icons';

type ListDetailScreenRouteProp = RouteProp<RootStackParamList, 'ListDetail'>;
type ListDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ListDetail'>;

interface ListItem {
  id: string;
  name: string;
  completed: boolean;
}

export default function ListDetailScreen() {
  const route = useRoute<ListDetailScreenRouteProp>();
  const navigation = useNavigation<ListDetailScreenNavigationProp>();
  const { listId } = route.params;

  const [items, setItems] = useState<ListItem[]>([
    { id: '1', name: 'Milk', completed: false },
    { id: '2', name: 'Bread', completed: true },
    { id: '3', name: 'Eggs', completed: false },
  ]);
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now().toString(), name: newItem.trim(), completed: false }]);
      setNewItem('');
    }
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => toggleItem(item.id)}>
      <Ionicons
        name={item.completed ? 'checkbox' : 'square-outline'}
        size={24}
        color={item.completed ? '#007AFF' : '#999'}
      />
      <Text style={[styles.itemText, item.completed && styles.completedItem]}>{item.name}</Text>
    </TouchableOpacity>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ShareList', { listId })}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, listId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Add new item"
          onSubmitEditing={addItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 18,
    marginLeft: 16,
  },
  completedItem: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

