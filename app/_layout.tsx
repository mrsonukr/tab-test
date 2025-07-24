import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          presentation: 'card',
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
          presentation: 'card',
          animationTypeForReplace: 'push',
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
