import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Login from './login';
import { useEffect } from 'react';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the App</Text>
      <Link href="/groups/">Groups</Link>
      <Link href="/login">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: 'center', alignItems: 'center', flex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  link: { fontSize: 18, color: 'blue' },
});
