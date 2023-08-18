import 'react-native-url-polyfill/auto'

import * as SecureStore from 'expo-secure-store'

// import AsyncStorage from '@react-native-async-storage/async-storage'
import {SUPABASE_KEY} from "@env"
import { createClient } from '@supabase/supabase-js'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

const supabaseUrl = 'https://jpunwxorjuwpdawrijru.supabase.co'
const supabaseAnonKey = SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    // storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})