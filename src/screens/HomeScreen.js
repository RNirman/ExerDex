import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

export default function HomeScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadExercises();
    }, [])
  );

  const loadExercises = async () => {
    try {
      const existingData = await AsyncStorage.getItem('exercises');
      if (existingData) {
        setExercises(JSON.parse(existingData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExercise = async (id) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to remove this?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const newSocket = exercises.filter(item => item.id !== id);
            setExercises(newSocket); // Update UI immediately
            await AsyncStorage.setItem('exercises', JSON.stringify(newSocket)); // Update Storage
          }
        }
      ]
    );
  };

  const renderItem = ({ item, drag, isActive }) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            onLongPress={drag}
            onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
            disabled={isActive}
            style={[
              styles.card,
              { backgroundColor: isActive ? '#f0f8ff' : '#fff' }
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditExercise', { exercise: item })}
                style={styles.actionBtn}
              >
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteExercise(item.id)}
                style={styles.actionBtn}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    };

  return (
    <View style={styles.container}>
          <DraggableFlatList
            data={exercises}
            onDragEnd={async ({ data }) => {
              setExercises(data);
              await AsyncStorage.setItem('exercises', JSON.stringify(data)); // Save new order
            }}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />

          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('AddExercise')}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 10,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },
  emptySubText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});