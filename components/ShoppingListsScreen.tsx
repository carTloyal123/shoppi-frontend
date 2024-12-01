import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { supabase } from '@/utils/supabase/supabase'
import { fetchShoppingLists, fetchUser, getUserGroups, ShoppingList } from '@/utils/supabase/service'
import { Session } from '@supabase/supabase-js'
import { UserGroup } from '@/types/database.types'

export default function ShoppingListsScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("Setting session for shopping lists!")
        setSession(session)
        console.log(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
    })
  }, [])

  useEffect(() => {
    if (session) {
        getLists()
    }
  }, [session])

  async function getLists(): Promise<void> {
    console.log("Getting user lists!")
    if (session !== null) {
        if (session.user !== null) {
            if (session.user.id !== null && session.user.email !== null) {
                const currentUser = await fetchUser(session!.user!.email!)
                const userGroups = await getUserGroups(currentUser.user_id)
                const userLists = userGroups.map(async (group: UserGroup) => {
                    return await fetchShoppingLists(group.groupId)
                })
                const lists = await Promise.all(userLists)
                setShoppingLists(lists.flat())                
            }
        }
    }

  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome, {session?.user?.email}!
      </Text>
      <Text style={styles.subHeader}>Your Shopping Lists:</Text>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  listItemText: {
    fontSize: 16,
  },
})

