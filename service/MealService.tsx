import type { Diet, Meal, Meals } from '../types';

// Function to get API configuration
const getApiConfig = () => ({
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.204:8080',
    apiKey: process.env.EXPO_PUBLIC_API_PASSWORD || '',
});

// Function to create headers
const createHeaders = () => {
    const { apiKey } = getApiConfig();
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
    };
};

// Fetch all available diets from the API
const fetchDiets = async (): Promise<Diet[]> => {
    try {
        const response = await fetch(`${getApiConfig().apiUrl}/api/diets`, {
            method: 'GET',
            headers: createHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('MealService - fetchDiets error:', error);
        throw error;
    }
};

// Fetch meals by diet ID
const fetchMealsByDietId = async (dietId: number): Promise<Meals[]> => {
    try {
        const response = await fetch(`${getApiConfig().apiUrl}/api/diets/${dietId.toString()}/meals`, {
            method: 'GET',
            headers: createHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('MealService - fetchMealsByDietId error:', error);
        throw error;
    }
};

// Fetch a single meal by ID
const fetchMealById = async (mealId: number): Promise<Meal> => {
    try {
        const response = await fetch(`${getApiConfig().apiUrl}/api/meals/${mealId.toString()}`, {
            method: 'GET',
            headers: createHeaders(),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('MealService - fetchMealById error:', error);
        throw error;
    }
};

const MealService = {
    fetchDiets,
    fetchMealsByDietId,
    fetchMealById,
};

export default MealService;