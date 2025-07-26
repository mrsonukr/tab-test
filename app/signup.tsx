import { MaterialCommunityIcons } from '@expo/vector-icons';
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

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rollNo: '',
    fullName: '',
    gender: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Basic validation
    if (!formData.rollNo.trim() || !formData.fullName.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (formData.mobileNo && formData.mobileNo.length !== 10) {
      Alert.alert('Error', 'Mobile number must be 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://hostelapis.mssonutech.workers.dev/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roll_no: formData.rollNo,
          full_name: formData.fullName,
          gender: formData.gender || 'male',
          mobile_no: formData.mobileNo,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      setLoading(false);

      if (response.status === 201 && data.success) {
        Alert.alert('Success', 'Account created successfully! Please login.', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to create account.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
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
            {/* Heading */}
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0B2447', marginBottom: 8 }}>
              Sign Up
            </Text>
            <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
              Create your account
            </Text>

            {/* Roll Number */}
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
                placeholder="Roll Number *"
                placeholderTextColor="#999"
                value={formData.rollNo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, rollNo: text }))}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: 'black',
                }}
                selectionColor="#0B2447"
              />
            </View>

            {/* Full Name */}

            {/* Mobile Number */}
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
              <MaterialCommunityIcons name="phone-outline" size={22} color="#999" />
              <TextInput
                placeholder="Mobile Number *"
                placeholderTextColor="#999"
                value={formData.mobileNo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, mobileNo: text }))}
                keyboardType="phone-pad"
                maxLength={10}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: 'black',
                }}
                selectionColor="#0B2447"
              />
            </View>

            {/* Email */}
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
              <MaterialCommunityIcons name="email-outline" size={22} color="#999" />
              <TextInput
                placeholder="Email *"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: 'black',
                }}
                selectionColor="#0B2447"
              />
            </View>

            {/* Password */}
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
              <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
              <TextInput
                placeholder="Password *"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
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

            {/* Confirm Password */}
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
                placeholder="Confirm Password *"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry={!showConfirmPassword}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: 'black',
                }}
                selectionColor="#0B2447"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <Button
              mode="contained"
              onPress={handleSignup}
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
              {loading ? <RNActivityIndicator color="#fff" /> : 'Sign Up'}
            </Button>

            {/* Login Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: '#666' }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={{ color: '#0B2447', fontWeight: 'bold' }}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}