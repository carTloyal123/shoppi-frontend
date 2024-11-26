import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { SupportedStorage } from "@supabase/supabase-js";

class SupabaseStorage implements SupportedStorage {
    async getItem(key: string) {
        if (Platform.OS === "web") {
        if (typeof localStorage === "undefined") {
            return null;
        }
        return localStorage.getItem(key);
        }
        return AsyncStorage.getItem(key);
    }
    async removeItem(key: string) {
        if (Platform.OS === "web") {
        return localStorage.removeItem(key);
        }
        return AsyncStorage.removeItem(key);
    }
    async setItem(key: string, value: string) {
        if (Platform.OS === "web") {
        return localStorage.setItem(key, value);
        }
        return AsyncStorage.setItem(key, value);
    }
}

export default SupabaseStorage;
