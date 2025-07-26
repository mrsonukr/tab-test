import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import CustomHeader from '../components/CustomHeader';

interface Student {
    roll_no: string;
    full_name?: string;
    gender?: string;
    mobile_no?: string;
    email?: string;
    hostel_no?: string | null;
    room_no?: string | null;
    email_verified?: boolean;
    created_at?: string;
    profile_pic_url?: string | null;
}

const ProfileInfo: React.FC = () => {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const router = useRouter();

    const fetchStudentData = useCallback(async () => {
        try {
            const studentData = await AsyncStorage.getItem('student');
            if (studentData) {
                const parsedData: Student = JSON.parse(studentData);
                setStudent(parsedData);

                const response = await fetch(
                    `https://hostelapis.mssonutech.workers.dev/api/student/${parsedData.roll_no}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
                const data = await response.json();

                if (response.status === 200 && data.success) {
                    setStudent(data.student);
                    await AsyncStorage.setItem('student', JSON.stringify(data.student));
                } else {
                    console.warn('API error:', data.error);
                    Alert.alert('Error', data.error || 'Failed to fetch latest data.');
                }
            } else {
                Alert.alert('Error', 'Please log in again.');
                router.replace('/login');
            }
        } catch (error: unknown) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to load user data.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useEffect(() => {
        fetchStudentData();
    }, [fetchStudentData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchStudentData();
    }, [fetchStudentData]);

    const capitalizeFirst = (str?: string) => (str ? str[0].toUpperCase() + str.slice(1) : '');

    if (loading) {
        return (
            <>
                <CustomHeader title="Profile Information" showBackButton onBackPress={() => router.back()} />
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0D0D0D" />
                </View>
            </>
        );
    }

    if (!student) {
        return (
            <>
                <CustomHeader title="Profile Information" showBackButton onBackPress={() => router.back()} />
                <View style={styles.container}>
                    <Text style={styles.error}>No user data found</Text>
                </View>
            </>
        );
    }

    return (
        <>
            <CustomHeader title="Profile Information" showBackButton onBackPress={() => router.back()} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />}
            >
                {/* Profile Information */}
                <View style={styles.section}>
                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Feather name="user" size={20} color="#0D0D0D" />
                            <Text style={styles.infoLabel}>Full Name</Text>
                        </View>
                        <Text style={styles.infoValue}>{student.full_name || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Feather name="phone" size={20} color="#0D0D0D" />
                            <Text style={styles.infoLabel}>Mobile Number</Text>
                        </View>
                        <Text style={styles.infoValue}>{student.mobile_no ? `+91${student.mobile_no}` : 'N/A'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Feather name="mail" size={20} color="#0D0D0D" />
                            <Text style={styles.infoLabel}>Email</Text>
                        </View>
                        <View style={styles.emailRow}>
                            <Text style={styles.infoValue}>{student.email || 'N/A'}</Text>
                            {!student.email_verified && student.email && (
                                <View style={styles.notVerifiedIcon}>
                                    <Text style={styles.exclamationText}>!</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Feather name={student.gender === 'female' ? 'user-x' : 'user-check'} size={20} color="#0D0D0D" />
                            <Text style={styles.infoLabel}>Gender</Text>
                        </View>
                        <Text style={styles.infoValue}>{capitalizeFirst(student.gender) || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Feather name="calendar" size={20} color="#0D0D0D" />
                            <Text style={styles.infoLabel}>Account Created</Text>
                        </View>
                        <Text style={styles.infoValue}>
                            {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Edit Profile Button */}
                <View style={styles.editButton} onStartShouldSetResponder={() => true}
                    onResponderRelease={() => router.push('/editprofile')}>
                    <Feather name="edit-3" size={20} color="#FFFFFF" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    contentContainer: { padding: 20, paddingBottom: 20 },

    section: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 20 },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E5E5EA',
    },
    infoLeft: { flexDirection: 'row', alignItems: 'center' },
    infoLabel: { fontSize: 16, color: '#000', marginLeft: 12 },
    infoValue: { fontSize: 16, color: '#666' },

    emailRow: { flexDirection: 'row', alignItems: 'center' },
    notVerifiedIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    exclamationText: { fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' },

    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D0D0D',
        paddingVertical: 16,
        marginVertical: 20,
        borderRadius: 50,
    },
    editButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },

    error: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
});

export default ProfileInfo;