import { supabase } from './supabase';
import { signUpWithEmail, signInWithEmail } from './auth';
import { Database, UserGroup } from '../../types/database.types';
import * as Crypto from 'expo-crypto';

export type Group = Database['public']['Tables']['groups']['Row'];
export type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
export type ShoppingListInsert = Database['public']['Tables']['shopping_lists']['Insert'];

export type ListItem = Database['public']['Tables']['list_items']['Row'];
export type ShoppiUser = Database['public']['Tables']['users']['Row'];
export type NewShoppiUser = Database['public']['Tables']['users']['Insert'];

const hashPassword = async (password: string): Promise<string | null> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    password
  );
  if (digest) {
    console.log('Password hashed:', digest);
    return digest;
  } else {
    console.error('Error hashing password');
    return null;
  }
}

// User information
const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  console.log('Comparing passwords:', plainPassword, hashedPassword);
  const newHashedPassword = await hashPassword(plainPassword);
  if (newHashedPassword === hashedPassword) {
    return true;
  }
  return false;
}

export const signUpUserWithEmailAndPassword = async (email: string, username: string, password: string): Promise<ShoppiUser> => {
  await signUpWithEmail(email, password);
  const currentSession = await supabase.auth.getUser();
  console.log('Current session:', currentSession);
  if (!currentSession) {
    throw new Error('Error signing up with supabase');
  }
  const existingUser = await fetchUser(email);
  if (existingUser) {
    console.error('User already exists, not creating or signing up');
    return existingUser;
  }

  const newUser = await createNewUserInDatabase(email, username, password);
  return newUser;
}

export const signInUserWithEmailAndPassword = async (email: string, password: string): Promise<ShoppiUser> => {
  // Sign in to supabase backend to get a valid session 
  await signInWithEmail(email, password);
  const currentUser = await supabase.auth.getUser();
  console.log('Current user:', currentUser);
  if (!currentUser) {
    throw new Error('Error signing in with supabase');
  }
  var existingUser = await fetchUser(email);
  if (!existingUser) {
    console.error('User does not exist in database, trying to create a new one');
    existingUser = await createNewUserInDatabase(email, email, password);
  }
  // compare the password
  console.log('Existing user:', existingUser);
  const passwordMatch = comparePassword(password, existingUser.password_hash);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }
  return existingUser;
}

export const fetchUser = async (email: string): Promise<ShoppiUser | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  console.log('Fetch User data:', data);
  console.log('Fetch User Error:', error);
  if (error ) {
    // check error code
    if (error.code === 'PGRST116') {
      console.error('User not found');
    }
    return null;
  }
  return data;
}

export const checkUserEmailExists = async (email: string): Promise<boolean> => {
  const user = await fetchUser(email);
  console.log('checkUserEmailExists: for user', user);
  return user !== null;
}

export const createNewUserInDatabase = async (email: string, username: string, unhashed_password: string): Promise<ShoppiUser> => {
  console.log('Creating new user:', email, username, unhashed_password);
  const hashed_password = await hashPassword(unhashed_password); // hash the password
  if (!hashed_password) {
    throw new Error('Error hashing password');
  }

  const newUser: NewShoppiUser = {
    email: email,
    password_hash: hashed_password,
    username: username,
  }

  // check our supabase session is active
  const supaBaseUser = await supabase.auth.getUser();
  console.log('Supabase user:', supaBaseUser);

  console.log('Inserting new user:', newUser);
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
export const fetchShoppingListsForGroup = async (groupId: number): Promise<ShoppingList[]> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('group_id', groupId);
  if (error) throw new Error(error.message);
  return data || [];
};

// Fetch shopping lists by user ID
export const fetchShoppingListsForUser = async (userId: number): Promise<ShoppingList[]> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data || [];
};

// Fetch shopping list by ID
export const fetchShoppingListById = async (listId: number): Promise<ShoppingList | null> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('list_id', listId)
    .single();
  if (error) throw new Error(error.message);
  return data || null;
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
export const addShoppingList = async (listName: string, ownerUserId: number | null): Promise<ShoppingList> => {
  const listToAdd: ShoppingListInsert = {
    list_name: listName,
    user_id: ownerUserId,
  };
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert(listToAdd)
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
