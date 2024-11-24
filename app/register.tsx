import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { signUpUser, uploadImage } from '../config/firebasemethod';
import { useRouter } from 'expo-router';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
  });

  const navigation = useNavigation();
  const router = useRouter();

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  // Function to handle user registration
  const loginUserFromFirebase = async (data) => {
    setLoading(true);
    const { fullName, email, password } = data;

    try {
      console.log('Starting user registration...');

      // Upload profile image if it exists
      const userProfileImageUrl = profileImage
        ? await uploadImage(profileImage, email)
        : null;

      console.log('Image upload completed:', userProfileImageUrl);

      // Sign up the user in Firebase
      await signUpUser({
        fullName,
        email,
        password,
        profileImage: userProfileImageUrl,
      });

      // After successful sign-up, navigate to the home screen
      console.log('User successfully registered');
      navigation.navigate('home');  // Ensure this matches the screen name in your navigator
      router.push("/tabs/home");
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Register</Text>

        {/* Full Name Field */}
        <Controller
          control={control}
          name="fullName"
          rules={{ required: 'Full Name is required' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
              />
              {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}
            </>
          )}
        />

        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </>
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </>
          )}
        />

        {/* Image Picker */}
        <View style={styles.imagePicker}>
          <Button title="Pick Profile Image" onPress={pickImage} />
          {profileImage && <Image source={{ uri: profileImage }} style={styles.imagePreview} />}
        </View>

        {/* Register Button */}
        <Button
          title={loading ? 'Registering...' : 'Register'}
          onPress={handleSubmit(loginUserFromFirebase)}
          disabled={!isValid || loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  imagePicker: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Register;
