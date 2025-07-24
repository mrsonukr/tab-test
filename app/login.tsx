import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'white' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <StatusBar style="dark" backgroundColor="white" />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 60 }}>
                    {/* Back Arrow */}
                    <TouchableOpacity onPress={() => router.push('/')} style={{ marginBottom: 20 }}>
                        <Ionicons name="chevron-back" size={28} color="#0B2447" />
                    </TouchableOpacity>

                    {/* Top Illustration */}
                    <View style={{ alignItems: 'center', marginBottom: 30 }}>
                        <Image
                            source={require('../assets/vectors/students.png')}
                            style={{ width: 200, height: 200, resizeMode: 'contain' }}
                        />
                    </View>

                    {/* Username Input */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#f2f4f7',
                            borderRadius: 30,
                            paddingHorizontal: 16,
                            height: 54,
                            marginBottom: 16,
                        }}
                    >
                        <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
                        <TextInput
                            placeholder="Username"
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
                            height: 54,
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
                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)')}
                        style={{
                            height: 54,
                            backgroundColor: '#008122',
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
                    </TouchableOpacity>

                    {/* Signup Link */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ color: '#666' }}>Don’t have an account? </Text>
                        <TouchableOpacity>
                            <Text style={{ color: '#0B2447', fontWeight: 'bold' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
