import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator as RNActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://hostelapis.mssonutech.workers.dev/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      setLoading(false);

      if (response.status === 200 && data.success) {
        // Save student data to AsyncStorage
        await AsyncStorage.setItem('student', JSON.stringify(data.student));
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.error || 'Invalid username or password.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
            {/* Heading and Description */}
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0B2447', marginBottom: 8 }}>
              Login
            </Text>
            <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
              Please sign in to continue
            </Text>

            {/* Username Input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f2f4f7',
                borderRadius: 30,
                paddingHorizontal: 16,
                height: 50,
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
              <TextInput
                placeholder="Roll Number or Mobile Number"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: 'black',
                }}
                selectionColor="#0B2447"
              />
            </View>

            {/* Password Input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f2f4f7',
                borderRadius: 30,
                paddingHorizontal: 16,
                height: 50,
                marginBottom: 24,
              }}
            >
              <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: 'black',
                }}
                selectionColor="#0B2447"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={loading}
              style={{
                height: 50,
                borderRadius: 30,
                justifyContent: 'center',
                backgroundColor: '#0D0D0D',
                marginBottom: 20,
              }}
              contentStyle={{
                height: 50,
              }}
              labelStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {loading ? <RNActivityIndicator color="#fff" /> : 'Sign In'}
            </Button>

            {/* Signup Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: '#666' }}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={{ color: '#0B2447', fontWeight: 'bold' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}