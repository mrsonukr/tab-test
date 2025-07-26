import { Stack } from 'expo-router';
import { useFrameworkReady } from '../hooks/useFrameworkReady'

export default function Layout() {
  useFrameworkReady();

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
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
