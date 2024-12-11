import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/useTheme';

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
    <Tabs.Screen
      name="lists"
      options={{
        title: 'Lists',
        headerShown: false,
        tabBarLabel: 'Lists', // Add this line
        headerTitle: 'Lists', // Add this line if you want the header title to match
        tabBarIcon: ({ color, size }) => (
          <Feather name="list" size={size} color={color} />
        ),
      }}
    />
      <Tabs.Screen
        name="auth"
        options={{
          title: 'Account',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={{
          href: null, // This hides the tab
        }}
      />
    </Tabs>
  );
}
