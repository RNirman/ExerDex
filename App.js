import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddExerciseScreen from './src/screens/AddExerciseScreen';
import EditExerciseScreen from './src/screens/EditExerciseScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#1E1E1E',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  contentStyle: {
    backgroundColor: '#121212',
  },
};

export default function App() {
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
    <NavigationContainer them={DarkTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
            headerStyle: {
              backgroundColor: '#1E1E1E',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 22,
              letterSpacing: 1,
            },
            headerShadowVisible: false,
              contentStyle: { backgroundColor: '#121212' },
        }}
        >
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