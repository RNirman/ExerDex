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

export default function EditExerciseScreen({ route, navigation }) {
  const { exercise } = route.params;

  const [name, setName] = useState(exercise.name);
  const [description, setDescription] = useState(exercise.description);
  const [imageUri, setImageUri] = useState(exercise.image);

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async () => {
    if (!status?.granted) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        Alert.alert("Permission Required", "Need gallery access.");
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

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open picker.");
    }
  };

  const updateExercise = async () => {
    if (!name || !description || !imageUri) {
      Alert.alert('Error', 'Fields cannot be empty.');
      return;
    }

    try {
      let finalImagePath = imageUri;

      if (imageUri !== exercise.image) {
        const fileName = imageUri.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({
          from: imageUri,
          to: newPath
        });
        finalImagePath = newPath;
      }

      const existingData = await AsyncStorage.getItem('exercises');
      let exercises = existingData ? JSON.parse(existingData) : [];

      const index = exercises.findIndex(item => item.id === exercise.id);

      if (index !== -1) {
        exercises[index] = {
          id: exercise.id,
          name: name,
          description: description,
          image: finalImagePath
        };

        await AsyncStorage.setItem('exercises', JSON.stringify(exercises));
        Alert.alert('Success', 'Exercise updated!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Exercise not found.');
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Visual Reference</Text>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      </View>

      <TouchableOpacity style={styles.buttonOutline} onPress={pickImage}>
        <Text style={styles.buttonOutlineText}>Change Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonFilled} onPress={updateExercise}>
        <Text style={styles.buttonFilledText}>Save Changes</Text>
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
  buttonOutline: { borderWidth: 2, borderColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonOutlineText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  buttonFilled: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 }, // Green color for Update
  buttonFilledText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});