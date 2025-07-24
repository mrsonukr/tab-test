import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

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
}

export default function Settings() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentData = await AsyncStorage.getItem('student');
        if (studentData) {
          const parsedData: Student = JSON.parse(studentData);
          setStudent(parsedData);
        } else {
          Alert.alert('Error', 'Please log in again.');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('student');
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#008122" />
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
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.info}>Roll Number: {student.roll_no}</Text>
      <Text style={styles.info}>Name: {student.full_name ?? 'N/A'}</Text>
      <Text style={styles.info}>Gender: {student.gender ?? 'N/A'}</Text>
      <Text style={styles.info}>Mobile: {student.mobile_no ?? 'N/A'}</Text>
      <Text style={styles.info}>Email: {student.email ?? 'N/A'}</Text>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B2447',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#ff4444',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});