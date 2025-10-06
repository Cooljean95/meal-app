import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Diet } from '../types';
import { Button, Card, LoadingSpinner } from '../components';
import IconComponent from '../components/Icon';
import MealService from '../service/MealService';
import WeatherService from '../service/WeatherService';

type RootStackParamList = {
  Home: undefined;
  Meals: { dietId: number };
  Meal: { mealId: number };
};

type WeatherData = {
  weather: Array<{ main: string }>;
  main: { temp: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData>({
    weather: [{ main: 'few clouds' }],
    main: { temp: 0 }
  });

  const fetchWeather = async () => {
    try {
      const data = await WeatherService.fetchWeather();
      setWeather(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
    }
  };

  const fetchDiets = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await MealService.fetchDiets();
      setDiets(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'unknown error';
      setError(`Could not fetch diets: ${errorMessage}`);
      console.error('Fetch error:', err);

      Alert.alert(
        'Error loading diets',
        'Could not fetch diet data.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiets();
    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={IconComponent.weatherIconMap(weather?.weather[0].main.toLowerCase())}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperatureText}>
          {Math.round(weather?.main.temp) + '°C'}
        </Text>
      </View>
      <Text style={styles.welcomeText}>Good morning</Text>
      <Text style={styles.subtitle}>Time to feast!</Text>

      {loading && (
        <LoadingSpinner text="Fetching diets..." />
      )}

      {error && (
        <Card style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Try Again"
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
                <TouchableOpacity
                  style={styles.dietItemContainer}
                  onPress={() => navigation.navigate('Meals', { dietId: item.id })}
                >
                  {IconComponent.dietIconMap(item.name, 33, '#666')}
                  <Text style={styles.dietName}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            numColumns={2}
            keyExtractor={(diet) => diet.id.toString()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7E8',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 75,
    height: 75,
  },
  temperatureText: {
    fontSize: 30,
    color: '#666',
    fontWeight: '600',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 25,
    color: '#666',
    marginBottom: 20,
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
    width: 275,
    height: 275,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 10,
  },
  dietButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 8,
  },
  dietItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fae9c9ff',
    borderRadius: 15,
    elevation: 2,
    minHeight: 60,
  },
  dietName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
    flex: 1,
  },
});