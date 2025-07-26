import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import InputField from '../../components/InputField';
import SubmitButton from '../../components/ui/SubmitButton';

export default function Tab() {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null); // ✅ Fix: image can be string or null

  const handleUpdate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated!');
    }, 2000);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Stable for older versions
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <CustomHeader title="Edit Profile" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 👤 Profile Image & Camera */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.imageWrapper}>
            <View style={styles.imageBorder}>
              <Image
                source={
                  image
                    ? { uri: image }
                    : require('../../assets/images/male.png')
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.cameraButton}>
              <Feather name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* ✅ Name and Verified Badge */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>John Doe</Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color="#0D0D0D"
              style={{ marginLeft: 6 }}
            />
          </View>

          {/* ✅ Roll Number below Name */}
          <Text style={styles.roll}>Roll No: 11231763</Text>
        </View>

        {/* 📱 Form Inputs */}
        <InputField
          label="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
        />
        <InputField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="yourmail@gmail.com"
          keyboardType="email-address"
        />
        <InputField
          label="Gender"
          value={gender}
          onChangeText={setGender}
          options={['Male', 'Female', 'Others']}
        />

        <SubmitButton
          title="Update"
          onPress={handleUpdate}
          loading={loading}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
});
