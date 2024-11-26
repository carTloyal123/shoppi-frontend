import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text } from 'react-native'
import { supabase } from '../utils/supabase/supabase'
import { Button, Input } from '@rneui/themed'
import { useSession } from '@/providers/SupabaseAuth'
import { router } from 'expo-router'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { session: localSession, signIn, signOut  }  = useSession()

  async function signInWithEmail() {
    setLoading(true)
    const {
      data: { session: newSession },
      error,
    }= await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    console.log("Session from SignInWithEmail: ")
    console.log(newSession)
    signIn()
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    signIn()
    setLoading(false)
  }

  useEffect(() => {
    console.log("Local Session: ", localSession || 'No session')
  })

  if (JSON.parse(localSession) !== null) {
    const actualSession = JSON.parse(localSession)
    console.log("Session from Auth: ", actualSession.session)
    return(
      <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text>You are signed in as {localSession}</Text>
        <Text
        onPress={() => {
          signOut();
          router.replace('/')
        }}>
        Sign Out
      </Text>
      </View>
      </View>
    )
  } else {
    return(
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text>You are signed in as {localSession}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
    )
  }
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

