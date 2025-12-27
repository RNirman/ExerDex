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
              { backgroundColor: isActive ? '#333' : '#1E1E1E' }
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
                <Ionicons name="pencil" size={22} color="#0A84FF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteExercise(item.id)}
                style={styles.actionBtn}
              >
                <Ionicons name="trash-outline" size={22} color="#FF453A" />
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
      padding: 8,
      marginLeft: 4,
      backgroundColor: '#2C2C2E',
      borderRadius: 8,
    },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#AAAAAA',
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
    backgroundColor: '#0A84FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
});