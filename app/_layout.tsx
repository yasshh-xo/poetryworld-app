import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="poem/[id]" />
        <Stack.Screen name="auth/login" />
      </Stack>
    </GestureHandlerRootView>
  );
}
