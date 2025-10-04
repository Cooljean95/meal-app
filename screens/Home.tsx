import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Diet } from '../types';
import { Button, Card, LoadingSpinner } from '../components';
import MealService from '../service/MealService';

type RootStackParamList = {
  Home: undefined;
  Meals: { dietId: number };
  Meal: { mealId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchDiets = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await MealService.fetchDiets();
      setDiets(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(`Kunne ikke hente dietter: ${errorMessage}`);
      console.error('Fetch error:', err);

      Alert.alert(
        'Feil ved lasting',
        'Kunne ikke hente diett-data. Sjekk at serveren kjører på localhost:8080',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velkommen til Meal App!</Text>
      <Text style={styles.subtitle}>Din personlige måltidsplanlegger</Text>

      {loading && (
        <LoadingSpinner text="Henter dietter..." />
      )}

      {error && (
        <Card style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Prøv igjen"
            onPress={fetchDiets}
            variant="danger"
            size="medium"
          />
        </Card>
      )}

      {!loading && !error && diets.length > 0 && (
        <View style={styles.dietsContainer}>
          <Image
            source={require('../assets/food_bowl.png')}
            style={styles.foodBowlImage}
          />
          <FlatList
            key="diet-list-2-columns"
            data={diets}
            renderItem={({ item }) => (
              <View style={styles.dietButtonContainer}>
                <Button
                  title={item.name}
                  onPress={() => navigation.navigate('Meals', { dietId: item.id })}
                  variant="primary"
                  size="medium"
                  textStyle={{
                    textAlign: 'right',
                    width: '100%'
                  }}
                />
              </View>
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            keyExtractor={(diet) => diet.id.toString()}
            style={styles.dietsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {!loading && !error && diets.length === 0 && (
        <Text style={styles.noDietsText}>Ingen dietter funnet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7E8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderWidth: 1,
    borderColor: '#fcc',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#c33',
    textAlign: 'center',
    marginBottom: 10,
  },
  dietsContainer: {
    flex: 1,
    width: '100%',
    marginVertical: 20,
  },
  foodBowlImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 10,
  },
  dietsList: {
    flex: 1,
    width: '100%',
  },
  row: {
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  dietButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  dietName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  dietDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noDietsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
});