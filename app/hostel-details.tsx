import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
  TouchableOpacity,
  View,
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

const HostelDetails: React.FC = () => {
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

  const getFloor = (roomNo?: string | null) => {
    if (!roomNo) return 'N/A';
    const firstDigit = parseInt(roomNo.charAt(0), 10);
    if (isNaN(firstDigit)) return 'N/A';
    return firstDigit === 1 ? 'Ground Floor' : `${firstDigit - 1}th Floor`;
  };

  const getHostelType = (hostelNo?: string | null) => {
    if (!hostelNo) return 'N/A';
    // You can customize this logic based on your hostel numbering system
    return `Hostel Block ${hostelNo}`;
  };

  if (loading) {
    return (
      <>
        <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0D0D0D" />
        </View>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
        <View style={styles.container}>
          <Text style={styles.error}>No user data found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <CustomHeader title="Hostel Details" showBackButton onBackPress={() => router.back()} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0D0D0D" />}
      >
        {/* Hostel Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accommodation Details</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name="home" size={20} color="#0D0D0D" />
              <Text style={styles.infoLabel}>Hostel Number</Text>
            </View>
            {student.hostel_no ? (
              <Text style={styles.infoValue}>{student.hostel_no}</Text>
            ) : (
              <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Hostel assignment feature will be available soon.')}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <Feather name="home" size={20} color="#0D0D0D" />
              <Text style={styles.infoLabel}>Room Number</Text>
            </View>
            {student.room_no ? (
              <Text style={styles.infoValue}>{student.room_no}</Text>
            ) : (
              <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Room assignment feature will be available soon.')}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="stairs" size={20} color="#0D0D0D" />
              <Text style={styles.infoLabel}>Floor</Text>
            </View>
            <Text style={styles.infoValue}>{getFloor(student.room_no)}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="office-building" size={20} color="#0D0D0D" />
              <Text style={styles.infoLabel}>Hostel Type</Text>
            </View>
            <Text style={styles.infoValue}>{getHostelType(student.hostel_no)}</Text>
          </View>
        </View>

        {/* Status Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <MaterialCommunityIcons 
                name={student.hostel_no && student.room_no ? "check-circle" : "clock-outline"} 
                size={24} 
                color={student.hostel_no && student.room_no ? "#4CAF50" : "#FF9800"} 
              />
              <Text style={styles.statusText}>
                {student.hostel_no && student.room_no ? "Accommodation Assigned" : "Pending Assignment"}
              </Text>
            </View>
            {student.hostel_no && student.room_no && (
              <Text style={styles.statusDescription}>
                You are currently assigned to Room {student.room_no} in Hostel {student.hostel_no}
              </Text>
            )}
            {(!student.hostel_no || !student.room_no) && (
              <Text style={styles.statusDescription}>
                Your hostel and room assignment is pending. Please contact the administration for updates.
              </Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Room change request feature will be available soon.')}>
            <MaterialCommunityIcons name="swap-horizontal" size={20} color="#0D0D0D" />
            <Text style={styles.actionButtonText}>Request Room Change</Text>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Maintenance request feature will be available soon.')}>
            <MaterialCommunityIcons name="tools" size={20} color="#0D0D0D" />
            <Text style={styles.actionButtonText}>Report Maintenance Issue</Text>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Roommate information feature will be available soon.')}>
            <MaterialCommunityIcons name="account-group" size={20} color="#0D0D0D" />
            <Text style={styles.actionButtonText}>View Roommates</Text>
            <Feather name="chevron-right" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  contentContainer: { padding: 20, paddingBottom: 20 },

  section: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { fontSize: 16, color: '#000', marginLeft: 12 },
  infoValue: { fontSize: 16, color: '#666' },
  addButtonText: { fontSize: 16, color: '#0D0D0D', fontWeight: '500' },

  statusCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 36,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },

  error: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
});

export default HostelDetails;