import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Home from './screens/Home';
import Meals from './screens/Meals';
import Meal from './screens/Meal';
import CreateMeal from './screens/CreateMeal';

import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fae9c9ff',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: 'Diet' }} />
        <Stack.Screen
          name="Meals"
          component={Meals}
          options={({ navigation, route }) => ({
            title: 'Meals',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CreateMeal', {
                    dietId: route.params.dietId,
                    dietName: route.params.dietName,
                  });
                }}
                style={{
                  padding: 8,
                  marginRight: 5,
                }}
              >
                <Ionicons name="add" size={24} color="#000000" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="CreateMeal" component={CreateMeal} options={{ title: 'Create New Meal' }} />
        <Stack.Screen name="Meal" component={Meal} options={{ title: 'Meal Details' }} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
