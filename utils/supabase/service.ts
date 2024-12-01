import { supabase } from './supabase';
import { Database, UserGroup } from '../../types/database.types';
import * as bcrypt from 'bcrypt';

type Group = Database['public']['Tables']['groups']['Row'];
export type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type ListItem = Database['public']['Tables']['list_items']['Row'];
type ShoppiUser = Database['public']['Tables']['users']['Row'];
type NewShoppiUser = Database['public']['Tables']['users']['Insert'];

// User information
export const fetchUser = async (email: string): Promise<ShoppiUser> => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error) throw new Error(error.message);
  return data;
}

const hashPassword = (password: string): string | null => {
  // hash the password
  const saltRounds = 10; // You can adjust this value for security vs performance
  const plainPassword = password;
  
  bcrypt.hash(plainPassword, saltRounds, (err: any, hash: string) => {
    if (err) {
      // Handle error
      console.error('Error hashing password:', err);
      return null;
    }
    // Store 'hash' in your database
    // Example: user.password = hash;
    console.log('Hashed password:', hash);
    return hash;
  });
  return null;
}

const comparePassword = (plainPassword: string, hashedPassword: string): boolean => {
  bcrypt.compare(plainPassword, hashedPassword, (err: any, result: boolean) => {
    if (err) {
      // Handle error
      console.error('Error comparing passwords:', err);
      return false;
    }
    console.log('Passwords match:', result);
    return result;
  });
  return false;
}

export const createNewUserInDatabase = async (email: string, username: string, unhashed_password: string): Promise<ShoppiUser> => {

  const hashed_password = hashPassword(unhashed_password); // hash the password
  if (!hashed_password) {
    throw new Error('Error hashing password');
  }

  const newUser: NewShoppiUser = {
    email: email,
    password_hash: hashed_password,
    username: username,
  }

  const { data, error } = await supabase
    .from('users')
    .insert(newUser)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Fetch all groups
export const fetchGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase.from('groups').select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

// Add a new group
export const addGroup = async (groupName: string): Promise<Group> => {
  const { data, error } = await supabase
    .from('groups')
    .insert({ group_name: groupName })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteGroup = async (groupId: number): Promise<void> => {
  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("group_id", groupId);
  if (error) throw new Error(error.message);
};

// Fetch shopping lists by group ID
export const fetchShoppingLists = async (groupId: number): Promise<ShoppingList[]> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('group_id', groupId);
  if (error) throw new Error(error.message);
  return data || [];
};

// Fetch the groups a user is a part of
export async function getUserGroups(userId: number): Promise<UserGroup[]> {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        group_id,
        role,
        groups (
          group_id,
          group_name,
          created_at
        )
      `)
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    if (!data) {
      return []
    }

    const userGroups = data.map((group: any) => ({
      groupId: group.groups.group_id,
      groupName: group.groups.group_name,
      createdAt: group.groups.created_at,
      userRole: group.role,
    }))
    console.log('User groups:', userGroups)
    return userGroups
  } catch (error) {
    console.error('Error fetching user groups:', error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

// Add a shopping list
export const addShoppingList = async (groupId: number, name: string): Promise<ShoppingList> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert(groupId ? { group_id: groupId, list_name: name } : { list_name: name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Fetch list items by shopping list ID
export const fetchListItems = async (listId: number): Promise<ListItem[]> => {
  if (!listId || Number.isNaN(listId))
  {
    console.error("No list ID provided: is nan: ", Number.isNaN(listId));
    return [];
  }
  const { data, error } = await supabase.from('list_items').select('*').eq('list_id', listId);
  if (error) throw new Error(error.message);
  return data || [];
};

// Add an item to a shopping list
export const addItem = async (listId: number, name: string): Promise<ListItem> => {
  const { data, error } = await supabase
    .from('list_items')
    .insert({ list_id: listId, item_name: name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Update an item (e.g., mark as purchased)
export const updateItem = async (itemId: number, updates: Partial<ListItem>): Promise<ListItem> => {
  const { data, error } = await supabase
    .from('list_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};
