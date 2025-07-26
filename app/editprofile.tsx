import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import InputField from '../components/InputField';
import SubmitButton from '../components/ui/SubmitButton';

interface Student {
  roll_no: string;
  full_name?: string;
  gender?: string;
  mobile_no?: string;
  email?: string;
  hostel_no?: string | null;
  room_no?: string | null;
  email_verified: boolean;
  created_at?: string;
  profile_pic_url?: string | null;
}

const EditProfile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    mobile_no: string;
    email: string;
    gender: string;
    profile_pic_url: string | null;
    newImage: ImagePicker.ImagePickerAsset | null;
  }>({
    mobile_no: '',
    email: '',
    gender: '',
    profile_pic_url: null,
    newImage: null,
  });
  const [originalData, setOriginalData] = useState<{
    mobile_no: string;
    email: string;
    gender: string;
    profile_pic_url: string | null;
  }>({
    mobile_no: '',
    email: '',
    gender: '',
    profile_pic_url: null,
  });
  const [errors, setErrors] = useState<{ mobile_no?: string; email?: string; gender?: string; image?: string }>({});
  const router = useRouter();

  const fetchStudentData = useCallback(async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        const parsedData: Student = JSON.parse(studentData);
        parsedData.email_verified = !!parsedData.email_verified;
        setStudent(parsedData);
        const initialFormData = {
          mobile_no: parsedData.mobile_no || '',
          email: parsedData.email || '',
          gender: parsedData.gender || '',
          profile_pic_url: parsedData.profile_pic_url || null,
          newImage: null,
        };
        setFormData(initialFormData);
        setOriginalData({
          mobile_no: parsedData.mobile_no || '',
          email: parsedData.email || '',
          gender: parsedData.gender || '',
          profile_pic_url: parsedData.profile_pic_url || null,
        });
      } else {
        Alert.alert('Error', 'Please log in again.');
        router.replace('/login');
      }
    } catch (error: unknown) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const hasChanges = () => {
    return (
      formData.mobile_no !== originalData.mobile_no ||
      formData.email !== originalData.email ||
      formData.gender !== originalData.gender ||
      formData.newImage !== null
    );
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please allow access to your photo library in device settings.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedImage = result.assets[0];
        if (!['image/jpeg', 'image/png'].includes(selectedImage.mimeType || '')) {
          setErrors((prev) => ({ ...prev, image: 'Only JPEG or PNG images are allowed.' }));
          return;
        }

        try {
          const compressedImage = await compressImageToWebP(selectedImage);
          setFormData((prev) => ({ ...prev, newImage: compressedImage }));
          setErrors((prev) => ({ ...prev, image: undefined }));
        } catch (error) {
          console.error('Image compression error:', error);
          setErrors((prev) => ({ ...prev, image: 'Failed to process image. Please try another image.' }));
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open gallery. Please check permissions or try again.');
    }
  };

  const compressImageToWebP = async (image: ImagePicker.ImagePickerAsset): Promise<ImagePicker.ImagePickerAsset> => {
    let quality = 0.6;
    let compressedImage = image;

    while (quality > 0.05) {
      const result = await manipulateAsync(
        compressedImage.uri,
        [{ resize: { width: 400 } }],
        {
          compress: quality,
          format: SaveFormat.WEBP,
        }
      );

      const response = await fetch(result.uri);
      const blob = await response.blob();
      const sizeInKB = blob.size / 1024;

      if (sizeInKB <= 50) {
        return {
          ...compressedImage,
          uri: result.uri,
          mimeType: 'image/webp',
        };
      }

      quality -= 0.05;
      compressedImage = {
        ...compressedImage,
        uri: result.uri,
      };
    }

    return compressedImage;
  };

  const validateForm = () => {
    const newErrors: { mobile_no?: string; email?: string; gender?: string; image?: string } = {};

    if (!formData.mobile_no || !/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Mobile number must be 10 digits.';
    }

    if (formData.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g., user@example.com).';
      }
    } else {
      newErrors.email = 'Email address is required.';
    }

    if (!formData.gender || !['Male', 'Female', 'Others'].includes(formData.gender)) {
      newErrors.gender = 'Please select a valid gender.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!hasChanges()) {
      Alert.alert('No Changes', 'No changes detected to save.');
      return;
    }

    if (!validateForm()) {
      Alert.alert('Error', 'Please fix the errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      let profilePicUrl = formData.profile_pic_url;

      if (formData.newImage) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', {
          uri: formData.newImage.uri,
          type: 'image/webp',
          name: 'profile.webp',
        } as any);

        const uploadResponse = await fetch('https://hostel.mssonukr.workers.dev/', {
          method: 'POST',
          body: formDataToSend,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.status === 200 && uploadData.urls && uploadData.urls.length > 0) {
          profilePicUrl = uploadData.urls[0];
        } else {
          throw new Error(uploadData.error || 'Image upload failed.');
        }
      }

      const updatePayload: Student = {
        ...student!,
        mobile_no: formData.mobile_no,
        email: formData.email || student!.email,
        gender: formData.gender,
        profile_pic_url: profilePicUrl,
      };

      const updateResponse = await fetch(
        `https://hostelapis.mssonutech.workers.dev/api/student/${student?.roll_no}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        }
      );

      const updateData = await updateResponse.json();
      if (updateResponse.status === 200 && updateData.success) {
        const updatedStudent: Student = {
          ...student!,
          ...updatePayload,
        };
        await AsyncStorage.setItem('student', JSON.stringify(updatedStudent));
        setStudent(updatedStudent);
        setOriginalData({
          mobile_no: formData.mobile_no,
          email: formData.email,
          gender: formData.gender,
          profile_pic_url: profilePicUrl,
        });
        setFormData((prev) => ({ ...prev, newImage: null }));
        Alert.alert('Success', 'Profile updated successfully!');
        router.back();
      } else {
        throw new Error(updateData.error || 'Failed to update profile.');
      }
    } catch (error: unknown) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.mainContainer}>
        <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
        <View style={styles.container}>
          <Text style={styles.errorText}>No user data found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.imageWrapper}>
            <View style={styles.imageBorder}>
              <Image
                source={
                  formData.newImage
                    ? { uri: formData.newImage.uri }
                    : formData.profile_pic_url
                      ? { uri: formData.profile_pic_url }
                      : require('../assets/images/male.png')
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.cameraButton}>
              <Feather name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {student.full_name || 'John Doe'}
            </Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color="#0D0D0D"
              style={{ marginLeft: 6 }}
            />
          </View>

          <Text style={styles.roll}>Roll No: {student.roll_no}</Text>
        </View>

        <InputField
          label="Mobile Number"
          value={formData.mobile_no}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, mobile_no: text }))}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
          error={errors.mobile_no}
        />
        <InputField
          label="Email Address"
          value={formData.email}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
          placeholder="yourmail@example.com"
          keyboardType="email-address"
          error={errors.email}
        />
        <InputField
          label="Gender"
          value={formData.gender}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, gender: text }))}
          options={['Male', 'Female', 'Others']}
          error={errors.gender}
        />

        <SubmitButton
          title="Update"
          onPress={handleUpdate}
          loading={submitting}
          disabled={submitting || !hasChanges()}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff', // Set the entire page background to white
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageBorder: {
    borderWidth: 2,
    borderColor: '#0D0D0D',
    borderRadius: 999,
    padding: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: '#e5e5e5',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#0D0D0D',
    padding: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  roll: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditProfile;