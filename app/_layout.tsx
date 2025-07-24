// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Welcome screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Tabs group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
