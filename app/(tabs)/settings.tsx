import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';

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
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const getDefaultProfileImage = (gender?: string) =>
    gender?.toLowerCase() === 'female'
      ? require('../../assets/images/female.png')
      : require('../../assets/images/male.png');

  const SkeletonLoader = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }, []);

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <Animated.View
        style={[
          styles.profileImage,
          {
            backgroundColor: '#E5E5EA',
            opacity,
          },
        ]}
      />
    );
  };

  if (loading) {
    return (
      <>
        <CustomHeader title="Settings" />
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0D0D0D" />
        </View>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <CustomHeader title="Settings" />
        <View style={styles.container}>
          <Text style={styles.error}>No user data found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <CustomHeader title="Settings" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0D0D0D"
          />
        }
      >
        {/* Modified Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <View style={styles.profileImageContainer}>
                {imageLoading && <SkeletonLoader />}
                <Image
                  source={
                    student.profile_pic_url && student.profile_pic_url.startsWith('http')
                      ? { uri: student.profile_pic_url }
                      : getDefaultProfileImage(student.gender)
                  }
                  style={[
                    styles.profileImage,
                    { opacity: imageLoading ? 0 : 1, position: 'absolute' },
                  ]}
                  onLoadStart={() => setImageLoading(true)}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </View>

              <View style={styles.nameBlock}>
                <View style={styles.nameContainer}>
                  <Text style={styles.profileName}>
                    {student.full_name || 'Student Name'}
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={18}
                      color="#0D0D0D"
                    />
                  </View>
                </View>
                <Text style={styles.profileRoll}>Roll No: {student.roll_no}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/editprofile')}>
            <View style={styles.settingLeft}>
              <Feather name="user" size={20} color="#0D0D0D" />
              <Text style={styles.settingLabel}>Profile Information</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/hostel-details')}>
            <View style={styles.settingLeft}>
              <Feather name="home" size={20} color="#0D0D0D" />
              <Text style={styles.settingLabel}>Hostel Details</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Feature coming soon')}>
            <View style={styles.settingLeft}>
              <Feather name="lock" size={20} color="#0D0D0D" />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Feature coming soon')}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color="#0D0D0D" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Feature coming soon')}>
            <View style={styles.settingLeft}>
              <Feather name="file-text" size={20} color="#0D0D0D" />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Feature coming soon')}>
            <View style={styles.settingLeft}>
              <Feather name="help-circle" size={20} color="#0D0D0D" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 20, paddingBottom: 20 },

  profileSection: {
    paddingVertical: 20,
    marginBottom: 20,
    borderRadius: 12,

  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  nameBlock: {
    justifyContent: 'center',
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
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
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


  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Settings;
