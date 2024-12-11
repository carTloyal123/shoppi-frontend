import { AuthProvider } from '@/src/auth/AuthContext';
import { ThemeProvider } from '@/src/theme/ThemeContext';
import { Stack } from 'expo-router/stack';
import { View } from 'react-native';

// In app/_layout.tsx
export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' }
          }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </AuthProvider>
    </ThemeProvider>
  );
}
