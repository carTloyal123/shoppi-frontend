import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../utils/supabase/useStorageState';
import { supabase } from '../utils/supabase/supabase';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: any | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          supabase.auth.getSession().then((data) => {
            setSession(JSON.stringify(data));
            console.log("Session from SignIn: ", data)
          });
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
