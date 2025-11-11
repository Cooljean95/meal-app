import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps, } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card, SearchBar, Overlay } from '../components';
import { Meals as MealsType } from '../types';
import MealService from '../service/MealService';

type RootStackParamList = {
    Home: undefined;
    Meals: { dietId: number; dietName: string };
    Meal: { mealId: number };
};

type MealsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Meals'>;
type MealsScreenProps = NativeStackScreenProps<RootStackParamList, 'Meals'>;

export default function Meals() {
    const navigation = useNavigation<MealsScreenNavigationProp>();
    const route = useRoute<MealsScreenProps['route']>();
    const { dietId } = route.params;

    const [meals, setMeals] = useState<MealsType[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<MealsType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilterOverlay, setShowFilterOverlay] = useState<boolean>(false);

    const fetchMeals = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await MealService.fetchMealsByDietId(dietId);
            setMeals(data);
            setFilteredMeals(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'unknown error';
            setError(`Could not fetch meals: ${errorMessage}`);
            console.error('Fetch error:', err);

            Alert.alert(
                'Error loading meals',
                'Could not fetch meals data.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchMeals();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredMeals(meals);
        } else {
            const filtered = meals.filter(meal =>
                meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meal.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMeals(filtered);
        }
    }, [searchQuery, meals]);

    const renderMealItem = ({ item }: { item: (typeof meals)[0] }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Meal', { mealId: item.id })}>
            <Card>
                <View style={styles.mealContainer}>
                    <Image source={require('../assets/foodBowl.png')} style={styles.mealImage} />
                    <View style={styles.mealContent}>
                        <Text style={styles.mealName}>{item.name}</Text>
                        <Text
                            style={styles.mealDescription}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.description}
                        </Text>
                        <View style={styles.mealFooter}>
                            <Text style={styles.mealInfo}>{item.calories || 'N/A'} kcal</Text>
                            <Text style={styles.mealInfo}>{item.prepTime || 'N/A'} min</Text>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{route.params.dietName}</Text>

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search meals..."
                    style={styles.searchBar}
                />
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowFilterOverlay(true)}
                >
                    <Ionicons name="options-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredMeals}
                renderItem={renderMealItem}
                keyExtractor={meal => meal.id.toString()}
                style={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <Overlay
                visible={showFilterOverlay}
                onClose={() => setShowFilterOverlay(false)}
            >
                <Text style={styles.overlayTitle}>Filter Options</Text>
                <Text style={styles.overlayContent}>Filter content will go here...</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowFilterOverlay(false)}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </Overlay>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF8E9',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    searchBar: {
        flex: 1,
    },
    filterButton: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    overlayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    overlayContent: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        flex: 1,
    },
    mealItem: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    mealContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 100,
    },
    mealImage: {
        width: '30%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    mealContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    mealName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    mealDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
        flex: 1,
    },
    mealFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealInfo: {
        fontSize: 12,
        color: '#888',
        fontWeight: '900',
    },
    mealCuisine: {
        fontSize: 14,
        color: '#666',
    },
});