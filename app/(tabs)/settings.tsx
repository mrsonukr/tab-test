import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

const Settings: React.FC = () => {
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

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('student');
            router.replace('/login');
          } catch (error: unknown) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to log out.');
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/editprofile');
  };

  const handleChangePassword = () => {
    Alert.alert('Feature', 'Change Password feature coming soon!');
  };

  const handleNotifications = () => {
    Alert.alert('Feature', 'Notifications settings coming soon!');
  };

  const handlePrivacy = () => {
    Alert.alert('Feature', 'Privacy & Security settings coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Feature', 'Help & Support coming soon!');
  };

  const handleAddHostel = () => {
    Alert.alert('Feature', 'Coming soon');
  };

  const handleAddRoom = () => {
    Alert.alert('Feature', 'Coming soon');
  };

  const getDefaultProfileImage = (gender?: string) => {
    return gender?.toLowerCase() === 'female'
      ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const capitalizeFirst = (str?: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getFloor = (roomNo?: string | null) => {
    if (!roomNo) return 'N/A';
    const firstDigit = parseInt(roomNo.charAt(0), 10);
    if (isNaN(firstDigit)) return 'N/A';
    if (firstDigit === 1) return 'Ground Floor';
    return `${firstDigit - 1}th Floor`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007B5D" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No user data found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007B5D" />}
    >
      <View style={styles.profileSection}>
        <Image
          source={{ uri: student.profile_pic_url || getDefaultProfileImage(student.gender) }}
          style={styles.profileImage}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.profileName}>{student.full_name || 'Student Name'}</Text>
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={18} color="green" />
          </View>
        </View>
        <Text style={styles.profileRoll}>Roll No: {student.roll_no || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <Feather name="user" size={20} color="#007B5D" />
            <Text style={styles.infoLabel}>Full Name</Text>
          </View>
          <Text style={styles.infoValue}>{student.full_name || 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <Feather name="phone" size={20} color="#007B5D" />
            <Text style={styles.infoLabel}>Mobile Number</Text>
          </View>
          <Text style={styles.infoValue}>{student.mobile_no ? `+91${student.mobile_no}` : 'N/A'}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <Feather name="mail" size={20} color="#007B5D" />
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
            <Feather name={student.gender === 'female' ? 'user-x' : 'user-check'} size={20} color="#007B5D" />
            <Text style={styles.infoLabel}>Gender</Text>
          </View>
          <Text style={styles.infoValue}>{capitalizeFirst(student.gender) || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hostel Details</Text>
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <Feather name="home" size={20} color="#007B5D" />
            <Text style={styles.infoLabel}>Hostel Number</Text>
          </View>
          {student.hostel_no ? (
            <Text style={styles.infoValue}>{student.hostel_no}</Text>
          ) : (
            <TouchableOpacity onPress={handleAddHostel}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <Feather name="home" size={20} color="#007B5D" />
            <Text style={styles.infoLabel}>Room Number</Text>
          </View>
          {student.room_no ? (
            <Text style={styles.infoValue}>{student.room_no}</Text>
          ) : (
            <TouchableOpacity onPress={handleAddRoom}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <MaterialCommunityIcons name="stairs" size={20} color="#007B5D" />
            <Text style={styles.infoLabel}>Floor</Text>
          </View>
          <Text style={styles.infoValue}>{getFloor(student.room_no)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
          <View style={styles.settingLeft}>
            <Feather name="edit-3" size={20} color="#007B5D" />
            <Text style={styles.settingLabel}>Edit Profile</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
          <View style={styles.settingLeft}>
            <Feather name="lock" size={20} color="#007B5D" />
            <Text style={styles.settingLabel}>Change Password</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleNotifications}>
          <View style={styles.settingLeft}>
            <Feather name="bell" size={20} color="#007B5D" />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
          <View style={styles.settingLeft}>
            <Feather name="shield" size={20} color="#007B5D" />
            <Text style={styles.settingLabel}>Privacy & Security</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
          <View style={styles.settingLeft}>
            <Feather name="help-circle" size={20} color="#007B5D" />
            <Text style={styles.settingLabel}>Help & Support</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
    borderRadius: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginRight: 6,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRoll: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
  },
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
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  addButtonText: {
    fontSize: 16,
    color: '#007B5D',
    fontWeight: '500',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notVerifiedIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  exclamationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: 8,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Settings;