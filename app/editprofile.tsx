import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
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

const EditProfile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    mobile_no: string;
    email: string;
    profile_pic_url: string | null;
    newImage: ImagePicker.ImagePickerAsset | null;
  }>({
    mobile_no: '',
    email: '',
    profile_pic_url: null,
    newImage: null,
  });
  const [originalData, setOriginalData] = useState<{
    mobile_no: string;
    email: string;
    profile_pic_url: string | null;
  }>({
    mobile_no: '',
    email: '',
    profile_pic_url: null,
  });
  const [errors, setErrors] = useState<{ mobile_no?: string; email?: string; image?: string }>({});
  const router = useRouter();

  const fetchStudentData = useCallback(async () => {
    try {
      const studentData = await AsyncStorage.getItem('student');
      if (studentData) {
        const parsedData: Student = JSON.parse(studentData);
        setStudent(parsedData);
        const initialFormData = {
          mobile_no: parsedData.mobile_no || '',
          email: parsedData.email || '',
          profile_pic_url: parsedData.profile_pic_url || null,
        };
        setFormData({
          ...initialFormData,
          newImage: null,
        });
        setOriginalData(initialFormData);
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

  // Check if there are any changes
  const hasChanges = () => {
    return (
      formData.mobile_no !== originalData.mobile_no ||
      formData.email !== originalData.email ||
      formData.newImage !== null
    );
  };
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Please allow access to your photo library.');
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
        // Compress and convert to WebP
        const compressedImage = await compressImageToWebP(selectedImage);
        setFormData((prev) => ({ ...prev, newImage: compressedImage }));
      } catch (error) {
        console.error('Image compression error:', error);
        setErrors((prev) => ({ ...prev, image: 'Failed to process image. Please try another image.' }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const compressImageToWebP = async (image: ImagePicker.ImagePickerAsset): Promise<ImagePicker.ImagePickerAsset> => {
    let quality = 0.6;
    let compressedImage = image;

    // Keep compressing until under 50KB or quality gets too low
    while (quality > 0.05) {
      const result = await manipulateAsync(
        compressedImage.uri,
        [{ resize: { width: 400 } }], // Resize to max 400px width for smaller file
        {
          compress: quality,
          format: SaveFormat.WEBP,
        }
      );

      // Check file size (approximate)
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

    // If still too large, return the last compressed version
    return compressedImage;
  };

  const validateForm = () => {
    const newErrors: { mobile_no?: string; email?: string; image?: string } = {};
    if (!formData.mobile_no || !/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Mobile number must be 10 digits.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
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

      // Upload image if a new one is selected
      if (formData.newImage) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', {
          uri: formData.newImage.uri,
          type: 'image/webp',
          name: 'profile.webp',
        } as any); // Note: 'as any' is used due to React Native FormData limitations; ideally, use a typed FormData library if available

        const uploadResponse = await fetch('https://hostel.mssonukr.workers.dev/', {
          method: 'POST',
          body: formDataToSend,
          headers: {
            // Note: Content-Type is omitted as FormData sets it automatically
          },
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.status === 200 && uploadData.urls && uploadData.urls.length > 0) {
          profilePicUrl = uploadData.urls[0];
        } else {
          throw new Error(uploadData.error || 'Image upload failed.');
        }
      }

      // Prepare update payload with all student data to avoid NOT NULL constraint errors
      const updatePayload: Student = {
        ...student!,
        mobile_no: formData.mobile_no,
        email: formData.email || student!.email,
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
        // Update AsyncStorage
        const updatedStudent: Student = {
          ...student!,
          ...updatePayload,
        };
        await AsyncStorage.setItem('student', JSON.stringify(updatedStudent));
        setStudent(updatedStudent);
        // Update original data to reflect saved changes
        setOriginalData({
          mobile_no: formData.mobile_no,
          email: formData.email,
          profile_pic_url: profilePicUrl,
        });
        setFormData(prev => ({ ...prev, newImage: null }));
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
      <>
        <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
        <PaperProvider>
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#007B5D" />
          </View>
        </PaperProvider>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
        <PaperProvider>
          <View style={styles.container}>
            <Text style={styles.error}>No user data found</Text>
          </View>
        </PaperProvider>
      </>
    );
  }

  return (
    <>
      <CustomHeader title="Edit Profile" showBackButton onBackPress={() => router.back()} />
      <PaperProvider>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          {/* Profile Picture */}
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{
                  uri:
                    formData.newImage
                      ? formData.newImage.uri
                      : formData.profile_pic_url ||
                      (student.gender?.toLowerCase() === 'female'
                        ? 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
                        : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'),
                }}
                style={styles.profileImage}
              />
              <View style={styles.editIcon}>
                <Feather name="edit-3" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
          </View>

          {/* Mobile Number */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Feather name="phone" size={20} color="#007B5D" />
              <Text style={styles.label}>Mobile Number</Text>
            </View>
            <TextInput
              style={[styles.input, errors.mobile_no ? styles.inputError : null]}
              value={formData.mobile_no}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, mobile_no: text }))}
              keyboardType="phone-pad"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            {errors.mobile_no && <Text style={styles.errorText}>{errors.mobile_no}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Feather name="mail" size={20} color="#007B5D" />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={formData.email}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
              keyboardType="email-address"
              placeholder="Enter email (optional)"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={submitting || !hasChanges()}
            style={{
              height: 50,
              borderRadius: 30,
              justifyContent: 'center',
              backgroundColor: (!hasChanges() || submitting) ? '#E5E5EA' : '#008122',
              marginHorizontal: 20,
              marginTop: 20,
              elevation: 0,
            }}
            contentStyle={{
              height: 50,
            }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: 'white',
            }}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : 'Save Changes'}
          </Button>
        </View>
        </ScrollView>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  editIcon: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    backgroundColor: '#007B5D',
    borderRadius: 12,
    padding: 4,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditProfile;