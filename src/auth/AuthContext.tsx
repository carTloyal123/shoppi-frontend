import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ShoppiUser, signInUserWithEmailAndPassword } from '@/utils/supabase/service';
import { User as SBUser } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/supabase';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

type User = {
  supabaseUser: SBUser;
  shoppiUser: ShoppiUser;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkForExistingSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      console.log('Auth session:', session);
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function setItemLocallyAsync(key: string, value: any) {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else { // mobile
        await SecureStore.setItemAsync(key, value.toString());
      }
    } catch (error) {
      console.error("Error saving data:", error); 
    }
  }
  
  async function getValueFor(key: string): Promise<any> {
    try {
      if (Platform.OS === 'web') {
        const result = await AsyncStorage.getItem(key);
        return result;
      } else {
        const result = await SecureStore.getItemAsync(key);
        return result;
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  }

  async function removeValue(key: string) {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error("Error removing data:", error);
    }
  }

  const checkForExistingSession = async () => {
    try {
      const userJson = await getValueFor('user');
      if (userJson) {
        console.log("Trying to login to supabase with user credentials");
        const user = JSON.parse(userJson);
        setUser(user);
        console.log("User session restored", user);
      }
    } catch (error) {
      console.error('Error checking for existing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call the login API
      const currentShoppiUser = await signInUserWithEmailAndPassword(email, password);
      const currentSupabaseUser = await supabase.auth.getUser();
      if (!currentSupabaseUser.data.user) {
        throw new Error('Error getting current user: ' + currentSupabaseUser.error?.message);
      }
      const user = { supabaseUser: currentSupabaseUser.data.user, shoppiUser: currentShoppiUser };
      await setItemLocallyAsync('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      await removeValue('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

