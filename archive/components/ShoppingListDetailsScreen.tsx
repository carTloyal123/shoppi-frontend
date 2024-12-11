import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ShoppingListDetailsRouteProp = RouteProp<RootStackParamList, 'ShoppingListDetails'>;

interface ShoppingListDetails {
  id: string;
  name: string;
  items: { id: string; name: string; quantity: number }[];
}

export const ShoppingListDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<ShoppingListDetailsRouteProp>();
  const [listDetails, setListDetails] = useState<ShoppingListDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const details: ShoppingListDetails = {
          id: route.params.listId,
          name: 'Sample List',
          items: [
            { id: '1', name: 'Apples', quantity: 5 },
            { id: '2', name: 'Bread', quantity: 2 },
            { id: '3', name: 'Milk', quantity: 1 },
          ],
        };
        setListDetails(details);
      } catch (error) {
        console.error('Error fetching list details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [route.params.listId]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{listDetails?.name}</Text>
      {listDetails?.items.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.itemQuantity, { color: colors.text }]}>Quantity: {item.quantity}</Text>
        </View>
      ))}
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
  itemContainer: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
  },
});

