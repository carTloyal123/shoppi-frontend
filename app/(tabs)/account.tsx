import LoginScreen from '@/components/LoginScreen';
import { StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { useColorScheme } from '~/lib/useColorScheme'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  const { isDarkColorScheme } = useColorScheme();
  const isDarkMode = isDarkColorScheme;
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

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
  };

  return (
    <View>
      <LoginScreen />
      {session && session.user ? (
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Welcome, {session.user.email} {JSON.stringify(session.user)}
        </Text>
      ) : (
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Please sign in to continue
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
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
});
