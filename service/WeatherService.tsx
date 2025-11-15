import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

// Function to get API configuration
const getApiConfig = () => ({
  weatherKey: process.env.EXPO_PUBLIC_WEATHER_API_KEY || '',
});

// Function to create headers
const createHeaders = () => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

// Get current position
export const getCurrentLocation = async (): Promise<LocationCoordinates> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('LocationService error:', error);
    throw error;
  }
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeather = async (): Promise<any> => {
  const location: LocationCoordinates = await getCurrentLocation();

  try {
    const headers = createHeaders();
    const { weatherKey: apiKey } = getApiConfig();

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WeatherService - fetchWeather error:', error);
    throw error;
  }
};

export default { fetchWeather };
