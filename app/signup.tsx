import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    ActivityIndicator as RNActivityIndicator,
} from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

export default function Signup() {
    const router = useRouter();
    const [rollNo, setRollNo] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = () => {
        if (!rollNo || !mobile || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <PaperProvider>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Please fill in the details</Text>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="account-outline" size={22} color="#999" />
                            <TextInput
                                placeholder="Roll Number"
                                placeholderTextColor="#999"
                                value={rollNo}
                                onChangeText={setRollNo}
                                style={styles.input}
                                selectionColor="#0B2447"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="cellphone" size={22} color="#999" />
                            <TextInput
                                placeholder="Mobile Number"
                                placeholderTextColor="#999"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="numeric"
                                style={styles.input}
                                selectionColor="#0B2447"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="email-outline" size={22} color="#999" />
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                style={styles.input}
                                selectionColor="#0B2447"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={styles.input}
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

                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="lock-outline" size={22} color="#999" />
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                style={styles.input}
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

                        <Button
                            mode="contained"
                            onPress={handleSignup}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                        >
                            {loading ? <RNActivityIndicator color="#fff" /> : 'Create Account'}
                        </Button>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.replace('/login')}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    inner: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#0B2447', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f4f7',
        borderRadius: 30,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 16,
    },
    input: { flex: 1, marginLeft: 12, fontSize: 16, color: 'black' },
    button: { height: 50, borderRadius: 30, justifyContent: 'center', backgroundColor: '#008122', marginBottom: 20 },
    buttonContent: { height: 50, justifyContent: 'center' },
    buttonLabel: { fontSize: 16, fontWeight: 'bold', color: 'white' },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    footerText: { color: '#666' },
    footerLink: { color: '#0B2447', fontWeight: 'bold' },
});
