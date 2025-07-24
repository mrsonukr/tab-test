// app/index.tsx
import { useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { Button } from './expo/ui';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 40 }}>

            {/* Top Image */}
            <View style={{ flex: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image
                    source={require('../assets/vectors/students.png')}
                    style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                />
            </View>

            {/* Welcome Text */}
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#111' }}>
                    Welcome to HostelCare
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, color: '#555' }}>
                    Start your journey with us. Explore, engage, and enjoy!
                </Text>
            </View>

            {/* Bottom Buttons */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        onPress={() => router.replace('/(tabs)')}
                        style={{ flex: 1, marginRight: 10 }}
                        color="success"
                        shape="pill"
                    >
                        Login
                    </Button>

                    <Button
                        onPress={() => router.replace('/(tabs)')}
                        style={{ flex: 1, marginLeft: 10 }}
                        color="success"
                        shape="pill"
                        variant="solid"
                    >
                        Signup
                    </Button>
                </View>
            </View>
        </View>
    );
}
