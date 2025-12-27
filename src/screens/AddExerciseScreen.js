import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddExerciseScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async () => {
      if (!status?.granted) {
        const permissionResponse = await requestPermission();
        if (!permissionResponse.granted) {
          Alert.alert("Permission Required", "We need access to your gallery to pick an image.");
          return;
        }
      }

      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log("Image Picker Result:", result);

        if (!result.canceled) {
          setImageUri(result.assets[0].uri);
        }
      } catch (error) {
        console.log("Error picking image:", error);
        Alert.alert("Error", "Could not open image picker.");
      }
    };

  const saveExercise = async () => {
    if (!name || !description || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and pick an image.');
      return;
    }

    try {
      const fileName = imageUri.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath
      });

      const newExercise = {
        id: Date.now().toString(),
        name: name,
        description: description,
        image: newPath
      };

      const existingData = await AsyncStorage.getItem('exercises');
      const exercises = existingData ? JSON.parse(existingData) : [];

      exercises.push(newExercise);

      await AsyncStorage.setItem('exercises', JSON.stringify(exercises));

      Alert.alert('Success', 'Exercise saved!');
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to save exercise.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bench Press"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the technique..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Visual Reference</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
      </View>

      <TouchableOpacity style={styles.buttonOutline} onPress={pickImage}>
        <Text style={styles.buttonOutlineText}>Pick Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonFilled} onPress={saveExercise}>
        <Text style={styles.buttonFilledText}>Save Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#121212', // Dark BG
    flexGrow: 1
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
    color: '#AAAAAA', // Light Grey Labels
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
    fontSize: 16,
    borderRadius: 12,
    backgroundColor: '#1E1E1E', // Dark Input BG
    color: '#FFFFFF' // White typing text
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  imageContainer: {
    height: 220,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed'
  },
  previewImage: { width: '100%', height: '100%' },
  placeholderText: { color: '#666' },

  // Buttons
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#0A84FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  buttonOutlineText: {
    color: '#0A84FF',
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonFilled: {
    backgroundColor: '#0A84FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  buttonFilledText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
});