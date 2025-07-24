// app/index.tsx
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 40 }}>

            {/* Image aligned toward center but bottom of its space */}
            <View style={{ flex: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image
                    source={require('../assets/vectors/students.png')}
                    style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                />
            </View>

            {/* Center Text */}
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#111' }}>
                    Welcome to HostelCare
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, color: '#555' }}>
                    Start your journey with us. Explore, engage, and enjoy!
                </Text>
            </View>

            {/* Bottom Button */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)')}
                    style={{
                        backgroundColor: '#2563eb',
                        paddingVertical: 16,
                        borderRadius: 30,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
