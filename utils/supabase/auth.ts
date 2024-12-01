import { Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export async function signInWithEmail( email: string, password: string )  {
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        throw new Error(error.message)
    }
}

export async function signUpWithEmail( email: string, password: string ): Promise<Session | null> {
    const {
        data: { session },
        error,
    } = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (error) {
        throw new Error(error.message)
    }
    return session
}
