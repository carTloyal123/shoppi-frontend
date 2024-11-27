import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchGroups, addGroup } from '@/utils/supabase/service';
import { Database } from '@/types/database.types';
import { useSession } from '@/providers/SupabaseAuth';

type Group = Database['public']['Tables']['groups']['Row'];

export default function GroupsPage() {
  // Use call to get all groups from database
  const [groups, setGroups] = useState<Group[]>([]); // State for groups
  const [loading, setLoading] = useState(false); // State for loading status
  const [newGroupName, setNewGroupName] = useState('');
  const {session, signIn} = useSession();

  // Function to fetch groups from the database
  const loadGroups = async () => {
    setLoading(true);
    signIn();
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (error) {
      if (error instanceof Error)
      {
        Alert.alert("Error", error.message);
      }    
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (!newGroupName) {
      Alert.alert("Error", "Group name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const newGroup = await addGroup(newGroupName); // Assume submitNewGroup is a function that sends the new group to the server
      setGroups([...groups, newGroup]);
      setNewGroupName('');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

    // Fetch groups when the component mounts
  useEffect(() => {
    loadGroups();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Groups for session: {session.session}</Text>
      {groups.map((group) => (
        <Link
          key={group.group_id}
          href={`/groups/${group.group_id}`}
          style={styles.link}>
          {group.group_name}
        </Link>
      ))}
      <TextInput
        style={styles.input}
        placeholder="New Group Name"
        value={newGroupName}
        onChangeText={setNewGroupName}
      />
      <Button title="Create Group" onPress={createGroup} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  link: { fontSize: 18, color: 'blue', marginBottom: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
});
