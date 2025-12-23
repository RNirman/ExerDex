import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddExerciseScreen from './src/screens/AddExerciseScreen';
import EditExerciseScreen from './src/screens/EditExerciseScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'ExerDex' }}
        />
        <Stack.Screen
          name="AddExercise"
          component={AddExerciseScreen}
          options={{ title: 'Add New Technique' }}
        />
        <Stack.Screen
            name="EditExercise"
            component={EditExerciseScreen}
            options={{ title: 'Edit Exercise' }}
        />
        <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetailScreen}
            options={{ title: 'Technique Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}