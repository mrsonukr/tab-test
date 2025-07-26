import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useFrameworkReady } from '../hooks/useFrameworkReady';

export default function Layout() {
  useFrameworkReady();
  const router = useRouter();

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
      <Stack.Screen
        name="editprofile"
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackVisible: false, // hide default back
          headerLeft: ({ canGoBack, tintColor }) =>
            canGoBack && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: -8, paddingRight: 12 }}
              >
                <Ionicons name="chevron-back" size={24} color={tintColor ?? '#000'} />
              </TouchableOpacity>
            ),
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
