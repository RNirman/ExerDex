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
      // 3. Check if permission is granted
      if (!status?.granted) {
        const permissionResponse = await requestPermission();
        // If user still says no, stop here
        if (!permissionResponse.granted) {
          Alert.alert("Permission Required", "We need access to your gallery to pick an image.");
          return;
        }
      }

      // 4. If granted, open the library
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        console.log("Image Picker Result:", result); // Debugging log

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
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, fontSize: 16, borderRadius: 8, backgroundColor: '#f9f9f9' },
  textArea: { height: 100, textAlignVertical: 'top' },
  imageContainer: { height: 200, backgroundColor: '#eee', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  placeholderText: { color: '#888' },
  buttonOutline: { borderWidth: 2, borderColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonOutlineText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  buttonFilled: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonFilledText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});