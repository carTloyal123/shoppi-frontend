import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ListsScreen from '@/components/ListsScreen';
import ListDetailScreen from '@/components/ListDetailScreen';
import ShareListScreen from '@/components/ShareListScreen';
import { useAuth } from '@/components/AuthContext';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';

export type RootStackParamList = {
  Lists: undefined;
  ListDetail: { listId: string };
  ShareList: { listId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function ListOverview() {
  const { user } = useAuth();

  // Get the current color scheme (light or dark)
  const { isDarkColorScheme } = useColorScheme();

  // Determine if we're in dark mode
  const isDarkMode = isDarkColorScheme;

  const colors = {
    background: isDarkMode ? '#1f2937' : '#f3f4f6',
    text: isDarkMode ? '#f9fafb' : '#111827',
    subtext: isDarkMode ? '#9ca3af' : '#6b7280',
    input: {
      background: isDarkMode ? '#374151' : '#ffffff',
      text: isDarkMode ? '#f9fafb' : '#111827',
      border: isDarkMode ? '#4b5563' : '#d1d5db',
    },
    button: {
      background: '#3b82f6',
      text: '#ffffff',
    },
    error: '#ef4444',
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please login to view your shopping lists</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.button.background }]} 
          onPress={() => (router.navigate('/account'))}
        >
          <Text style={[styles.buttonText, { color: colors.button.text }]}>
            Go to Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Lists">
      <Stack.Screen name="Lists" component={ListsScreen} options={{ title: 'My Shopping Lists' }} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} options={{ title: 'List Details' }} />
      <Stack.Screen name="ShareList" component={ShareListScreen} options={{ title: 'Share List' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    color: '#666',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 10,
  },
  button: {
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
  },
  errorMessage: {
    marginBottom: 12,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonClose: {
    marginTop: 10,
  },
});
