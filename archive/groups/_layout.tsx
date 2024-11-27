import { Text } from 'react-native';
import { Redirect, router, Stack, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useSession } from '../../../providers/SupabaseAuth';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const localparams = useLocalSearchParams();
  const globalParams = useGlobalSearchParams();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    console.log("REDIRECTING TO LOGIN FROM APP LAYOUT on way to groups", localparams.toString())
    console.log("REDIRECTING TO LOGIN FROM APP LAYOUT  on way to groups", JSON.stringify(globalParams))
    console.log("REDIRECTING TO LOGIN FROM APP LAYOUT on way to groups", JSON.stringify())
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
