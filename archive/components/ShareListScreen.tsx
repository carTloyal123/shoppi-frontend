import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../ListOverviews';
import { Ionicons } from '@expo/vector-icons';

type ShareListScreenRouteProp = RouteProp<RootStackParamList, 'ShareList'>;

interface SharedUser {
  id: string;
  name: string;
  email: string;
}

export default function ShareListScreen() {
  const route = useRoute<ShareListScreenRouteProp>();
  const { listId } = route.params;

  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ]);
  const [newEmail, setNewEmail] = useState('');

  const addUser = () => {
    if (newEmail.trim()) {
      const newUser: SharedUser = {
        id: Date.now().toString(),
        name: newEmail.split('@')[0],
        email: newEmail.trim(),
      };
      setSharedUsers([...sharedUsers, newUser]);
      setNewEmail('');
    }
  };

  const removeUser = (id: string) => {
    setSharedUsers(sharedUsers.filter(user => user.id !== id));
  };

  const renderItem = ({ item }: { item: SharedUser }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => removeUser(item.id)}>
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share List: {listId}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Enter email to share"
          keyboardType="email-address"
          autoCapitalize="none"
          onSubmitEditing={addUser}
        />
        <TouchableOpacity style={styles.addButton} onPress={addUser}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sharedUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
});

