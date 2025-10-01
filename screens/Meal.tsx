import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Meals: undefined;
  Meal: { mealId: string };
};

type MealScreenRouteProp = RouteProp<RootStackParamList, 'Meal'>;
type MealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Meal'>;

// Dummy meal data
const mealDetails: { [key: string]: any } = {
  '1': {
    name: 'Spaghetti Carbonara',
    cuisine: 'Italiensk',
    prepTime: '20 min',
    servings: 4,
    ingredients: [
      '400g spaghetti',
      '200g bacon',
      '4 egg',
      '100g parmesan ost',
      'Sort pepper',
      'Salt',
    ],
    instructions: [
      'Kok spaghetti i saltet vann',
      'Stek bacon til det er sprøtt',
      'Visp sammen egg og parmesan',
      'Bland alt sammen med den varme pastaen',
    ],
  },
  '2': {
    name: 'Taco Tuesday',
    cuisine: 'Meksikansk',
    prepTime: '15 min',
    servings: 6,
    ingredients: ['Kjøttdeig', 'Taco krydder', 'Løk', 'Tomater', 'Salat', 'Lefser'],
    instructions: ['Stek kjøttdeig', 'Tilsett krydder', 'Varm lefser', 'Server med tilbehør'],
  },
};

export default function Meal() {
  const route = useRoute<MealScreenRouteProp>();
  const navigation = useNavigation<MealScreenNavigationProp>();
  const { mealId } = route.params;

  const meal = mealDetails[mealId] || {
    name: 'Ukjent måltid',
    cuisine: 'Ukjent',
    prepTime: 'Ukjent',
    servings: 0,
    ingredients: [],
    instructions: [],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{meal.name}</Text>
        <Text style={styles.cuisine}>{meal.cuisine} kjøkken</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tilberedningstid:</Text>
          <Text style={styles.infoValue}>{meal.prepTime}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Porsjoner:</Text>
          <Text style={styles.infoValue}>{meal.servings}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredienser</Text>
        {meal.ingredients.map((ingredient: string, index: number) => (
          <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fremgangsmåte</Text>
        {meal.instructions.map((instruction: string, index: number) => (
          <Text key={index} style={styles.instruction}>
            {index + 1}. {instruction}
          </Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Tilbake til måltider</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cuisine: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredient: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  instruction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});