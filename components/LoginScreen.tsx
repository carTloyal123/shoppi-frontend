import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { signInWithEmail, signUpWithEmail } from '@/utils/supabase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get the current color scheme (light or dark)
  const { isDarkColorScheme } = useColorScheme();

  // Determine if we're in dark mode
  const isDarkMode = isDarkColorScheme;

  const handleLogin = () => {
    // Implement login logic here
    console.log('Login attempted with:', { email, password });
    signInWithEmail(email, password);
  };

  // Define colors based on the current theme
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>Enter your credentials to access your account</Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.input.background, borderColor: colors.input.border, color: colors.input.text }]}
          placeholder="name@example.com"
          placeholderTextColor={colors.subtext}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, { backgroundColor: colors.input.background, borderColor: colors.input.border, color: colors.input.text }]}
            placeholder="Enter your password"
            placeholderTextColor={colors.subtext}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color={colors.subtext}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.button.background }]} onPress={handleLogin}>
        <Text style={[styles.buttonText, { color: colors.button.text }]}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
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

