import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types'; // Import the generated Supabase types
import SupabaseStorage from './SupabaseStorage';

const supabaseUrl = "https://zcewhfinljjatiuszobw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZXdoZmlubGpqYXRpdXN6b2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzOTQ5NjcsImV4cCI6MjA0Nzk3MDk2N30.htgBTQocTqc72btqo_Gevs8r1QcbLSomMk0-4EZmxpI";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new SupabaseStorage,
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

