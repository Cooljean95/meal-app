import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Card } from '../components';

type RootStackParamList = {
    Home: undefined;
    Meals: { dietId: number };
    Meal: { mealId: number };
};

type MealsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Meals'>;
type MealsScreenProps = NativeStackScreenProps<RootStackParamList, 'Meals'>;

// Dummy data for testing
const mealsList = [
    { id: 1, name: 'Spaghetti Carbonara', cuisine: 'Italiensk' },
    { id: 2, name: 'Taco Tuesday', cuisine: 'Meksikansk' },
    { id: 3, name: 'Grillet Laks', cuisine: 'Nordisk' },
    { id: 4, name: 'Kylling Tikka Masala', cuisine: 'Indisk' },
    { id: 5, name: 'Caesar Salat', cuisine: 'Amerikansk' },
];

export default function Meals() {
    const navigation = useNavigation<MealsScreenNavigationProp>();
    const route = useRoute<MealsScreenProps['route']>();
    const { dietId } = route.params;

    const renderMealItem = ({ item }: { item: (typeof mealsList)[0] }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Meal', { mealId: item.id })}>
            <Card>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealCuisine}>{item.cuisine}</Text>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mine Måltider</Text>

            <FlatList
                data={mealsList}
                renderItem={renderMealItem}
                keyExtractor={meal => meal.id.toString()}
                style={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
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
    mealName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    mealCuisine: {
        fontSize: 14,
        color: '#666',
    },
});