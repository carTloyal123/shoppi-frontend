import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '../../../src/theme/useTheme';
import { ShoppingListItem } from '../../../src/components/ShoppingListItem';
import { CreateListModal } from '../../../src/components/CreateListModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/src/auth/AuthContext';
import { addShoppingList, fetchListItems, fetchShoppingListsForUser, ShoppingList } from '../../../utils/supabase/service';

export default function ShoppingListsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [listItemCounts, setListItemCounts] = useState<Map<ShoppingList, number>>(new Map());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuth();
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  const handleCreateList = async (name: string) => {
    console.log('Creating list:', name, "for user:", user);
    const addedList = await addShoppingList(name, user?.shoppiUser.user_id ?? null);
    setLists([...lists, addedList]);
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        // Simulating an API call
        if (!user) {
          setIsLoadingLists(false);
          console.log('No user found, skipping list fetch');
          return;
        }
        const userLists = await fetchShoppingListsForUser(user?.shoppiUser.user_id);
        // Need to get the number of items per list
        const listItems = await Promise.all(userLists.map((list) => fetchListItems(list.list_id)));
        const itemCounts = listItems.map((items) => items.length);
        const itemCountMap = new Map<ShoppingList, number>();
        userLists.forEach((list, index) => itemCountMap.set(list, itemCounts[index]));
        setListItemCounts(itemCountMap);
        setLists(userLists);
        setIsLoadingLists(false);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, [user]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.listItemBackground ?? '#000000'}]}>
      <Text style={[styles.title, { color: colors.text }]}>My Shopping Lists</Text>
      { user ? (
        <>
          <ScrollView style={styles.listContainer}>
          { isLoadingLists ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : ( 
              <View>
                {Array.from(listItemCounts.entries()).map(([list, itemCount]) => (
                  <Link key={list.list_id} href={`/lists/${list.list_id}`} asChild>
                    <TouchableOpacity>
                      <ShoppingListItem
                        name={list.list_name}
                        itemCount={itemCount}
                        isShared={list.group_id !== null}
                      />
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
          ) }
          </ScrollView>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsModalVisible(true)}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Create New List</Text>
          </TouchableOpacity>
          <CreateListModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onCreateList={handleCreateList}
          />
        </>
      ) : (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary ?? '#000000' }]}
          onPress={() => router.push('/auth')}
        >
          <Feather name="log-in" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Login to Continue</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

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
    borderRadius: 12,
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
