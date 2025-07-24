// app/index.tsx
import { useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <PaperProvider>
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
                    <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#008122' }}>
                        Welcome to HostelCare
                    </Text>
                    <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, color: '#555' }}>
                        Start your journey with us. Explore, engage, and enjoy!
                    </Text>
                </View>

                {/* Bottom Buttons */}
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            mode="contained"
                            onPress={() => router.push('/login')}
                            style={{
                                flex: 1,
                                marginRight: 10,
                                borderRadius: 30,
                                backgroundColor: '#008122',
                                elevation: 0, // Remove shadow (optional)
                            }}
                            contentStyle={{
                                height: 54, // Match original
                                justifyContent: 'center',
                            }}
                            labelStyle={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: 'white',
                            }}
                        >
                            Login
                        </Button>


                        <Button
                            mode="contained"
                            onPress={() => router.replace('/(tabs)')}
                            style={{
                                flex: 1,
                                marginLeft: 10,
                                borderRadius: 30,
                                backgroundColor: '#008122',
                                elevation: 0,
                            }}
                            contentStyle={{
                                height: 54,
                                justifyContent: 'center',
                            }}
                            labelStyle={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: 'white',
                            }}
                        >
                            Signup
                        </Button>
                    </View>
                </View>
            </View>
        </PaperProvider>
    );
}
