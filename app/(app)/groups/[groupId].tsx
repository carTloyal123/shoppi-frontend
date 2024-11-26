import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchListItems, addItem } from '@/utils/supabase/service';
import { Database } from '@/types/database.types';

type ListItem = Database['public']['Tables']['list_items']['Row'];

export default function ItemsPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      const fetchedItems = await fetchListItems(parseInt(groupId));
      setItems(fetchedItems);
    }
    fetchItems();
  }, [groupId]);

  const createItem = async () => {
    if (!newItemName) {
      Alert.alert("Error", "Item name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const newItem = await addItem(parseInt(groupId), newItemName); // Assume addItemToGroup is a function that sends the new item to the server
      setItems([...items, newItem]);
      setNewItemName('');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Items for Group {groupId}</Text>
      {items.length > 0 ? (
        items.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item.item_name}
          </Text>
        ))
      ) : (
        <Text>No items found for this group.</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="New Item Name"
        value={newItemName}
        onChangeText={setNewItemName}
      />
      <Button title="Create Item" onPress={createItem} disabled={loading} />
      <Link href={{ pathname: "/(groups)" }} style={{ color: 'blue', marginTop: 20 }}>
        Back to Groups
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 18, marginBottom: 5 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
});
