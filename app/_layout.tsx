import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments,Stack } from 'expo-router';
import { useFrameworkReady } from '../hooks/useFrameworkReady';

export default function Layout() {
  useFrameworkReady();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  const checkAuthState = useCallback(async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      setIsLoggedIn(!!studentData);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  useEffect(() => {
    if (isLoggedIn === null) return; // Still loading

    const inAuthGroup = segments[0] === '(tabs)';
    const inProtectedPages = ['editprofile', 'profile-info', 'hostel-details'].includes(segments[0] || '');

    if (isLoggedIn && !inAuthGroup && !inProtectedPages) {
      // User is logged in but not in tabs or protected pages, redirect to tabs
      router.replace('/(tabs)');
    } else if (!isLoggedIn && (inAuthGroup || inProtectedPages)) {
      // User is not logged in but trying to access protected content, redirect to welcome
      router.replace('/');
    }
  }, [isLoggedIn, segments, router]);

  // Show loading screen while checking auth state
  if (isLoggedIn === null) {
    return null; // or a loading screen component
  }

  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="signup" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="profile-info" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="hostel-details" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen
        name="editprofile"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          presentation: 'card',
          gestureEnabled: false, // Prevent swipe back from tabs
        }}
      />
    </Stack>
  );
}