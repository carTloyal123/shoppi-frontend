import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase/supabase'
import { Database } from '../types/database.types'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

type ProfileUpdate = Database['public']['Tables']['users']['Update']
type UserProfile = Database['public']['Tables']['users']['Update']

export default function Account({ session }: { session: Session }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('users')
        .select()
        .eq('email', session?.user.email || '')
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setCurrentUser(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
  }: {
    username: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')
      if (!currentUser || currentUser === null) throw new Error("No current user signed in!")
      if (!currentUser.email) throw new Error("Current user email is missing!")
      const userUpdate: ProfileUpdate = {
        user_id: currentUser.user_id || -1,
        username: username
      }

      const { error } = await supabase.from('users').update(userUpdate)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={currentUser?.username || ''} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Created At" value={currentUser?.created_at || ''} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
