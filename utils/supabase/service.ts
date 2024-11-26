import { supabase } from './supabase';
import { Database } from '../../types/database.types';

type Group = Database['public']['Tables']['groups']['Row'];
type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
type ListItem = Database['public']['Tables']['list_items']['Row'];
type ShoppiUser = Database['public']['Tables']['users']['Row'];

// User information
export const fetchUser = async (email: string): Promise<ShoppiUser> => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
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
  const { data, error } = await supabase.from('shopping_lists').select('*').eq('group_id', groupId);
  if (error) throw new Error(error.message);
  return data || [];
};

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
