import { Redirect, router } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '@/src/auth/AuthContext';
import { useTheme } from '@/src/theme/useTheme';

export default function Auth() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  if (!user) {
    return <Redirect href="/auth/signin" />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>Welcome, {user.shoppiUser.username}!</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/lists')}
      >
        <Text style={styles.buttonText}>Go to Lists!</Text>
      </TouchableOpacity>  
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>    
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});
