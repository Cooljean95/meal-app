import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card, SearchBar, Overlay, Button, LoadingSpinner } from '../components';
import { Meals as MealsType, Category } from '../types';
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
  const { dietId, dietName } = route.params;

  const [meals, setMeals] = useState<MealsType[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<MealsType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilterOverlay, setShowFilterOverlay] = useState<boolean>(false);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await MealService.fetchMealsByDietId(dietId);
      setMeals(data);
      setFilteredMeals(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Could not fetch meals: ${errorMessage}`);
      console.error('Fetch error:', err);

      Alert.alert('Error Loading Meals', 'Could not fetch meals data. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [dietId]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await MealService.fetchCategory();
      const categoryArray = Array.isArray(data) ? data : [data];
      setCategories(categoryArray);
      setFilteredCategories(categoryArray);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filteredMealsResult = meals;
    let filteredCategoriesResult = categories;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      filteredMealsResult = filteredMealsResult.filter(meal =>
        meal.name.toLowerCase().includes(query)
      );

      filteredCategoriesResult = filteredCategoriesResult.filter(category =>
        category.name.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filteredMealsResult = filteredMealsResult.filter(meal => {
        const mealNameLower = meal.name.toLowerCase();
        return categories.some(
          category =>
            selectedCategories.includes(category.id) &&
            mealNameLower.includes(category.name.toLowerCase())
        );
      });
    }

    setFilteredMeals(filteredMealsResult);
    setFilteredCategories(filteredCategoriesResult);
  }, [meals, categories, searchQuery, selectedCategories]);
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryToggle = useCallback((categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSearchQuery('');
    setFilteredCategories(categories);
  }, [categories]);

  const handleMealPress = useCallback(
    (mealId: number) => {
      navigation.navigate('Meal', { mealId });
    },
    [navigation]
  );

  useEffect(() => {
    fetchMeals();
    fetchCategories();
  }, [fetchMeals, fetchCategories]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const renderMealItem = useCallback(
    ({ item }: { item: MealsType }) => (
      <TouchableOpacity onPress={() => handleMealPress(item.id)} activeOpacity={0.7}>
        <Card>
          <View style={styles.mealContainer}>
            <Image
              source={require('../assets/foodBowl.png')}
              style={styles.mealImage}
              resizeMode="cover"
            />
            <View style={styles.mealContent}>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealDescription} numberOfLines={2} ellipsizeMode="tail">
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
    ),
    [handleMealPress]
  );

  const renderErrorState = () => (
    <Card style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Try Again" onPress={fetchMeals} variant="danger" size="medium" />
    </Card>
  );

  const renderEmptyState = () => (
    <Card style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No meals found matching your search.' : 'No meals available.'}
      </Text>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text="Loading meals..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dietName}</Text>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search meals..."
          style={styles.searchBar}
        />
        <TouchableOpacity
          style={[styles.filterButton]}
          onPress={() => setShowFilterOverlay(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={selectedCategories.length > 0 ? '#007AFF' : '#666'}
          />
          {selectedCategories.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedCategories.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {error && renderErrorState()}

      <FlatList
        data={filteredMeals}
        renderItem={renderMealItem}
        keyExtractor={meal => meal.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && !error ? renderEmptyState : null}
        contentContainerStyle={filteredMeals.length === 0 ? styles.emptyListContainer : undefined}
      />

      <Overlay visible={showFilterOverlay} onClose={() => setShowFilterOverlay(false)}>
        <Text style={styles.overlayTitle}>Filter</Text>

        <View style={styles.overlaySearchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search categories..."
            style={styles.overlaySearchBar}
          />
        </View>

        {categoriesLoading ? (
          <LoadingSpinner text="Loading categories..." />
        ) : (
          <View style={styles.categoryContainer}>
            {filteredCategories.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScrollContent}
                style={styles.categoryScrollView}
              >
                <View style={styles.categoryGrid}>
                  {filteredCategories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategories.includes(category.id) && styles.categoryButtonSelected,
                      ]}
                      onPress={() => handleCategoryToggle(category.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          selectedCategories.includes(category.id) &&
                            styles.categoryButtonTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.emptyCategoryContainer}>
                <Text style={styles.noCategoriesText}>
                  {searchQuery.trim()
                    ? 'No categories match your search'
                    : 'No categories available'}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.overlayActions}>
          {selectedCategories.length > 0 && (
            <Button
              title="Clear Filters"
              onPress={clearFilters}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
          )}
          <Button
            title="Done"
            onPress={() => setShowFilterOverlay(false)}
            variant="primary"
            size="medium"
            style={styles.actionButton}
          />
        </View>
      </Overlay>
    </View>
  );
}

const COLORS = {
  primary: '#007AFF',
  background: '#FEF8E9',
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#888888',
  border: '#E5E5E5',
  borderSecondary: '#dddddd',
  error: '#cc3333',
  errorBackground: '#ffeeee',
  errorBorder: '#ffcccc',
  overlay: '#f8f8f8',
  categoryBackground: '#f0f0f0',
  activeBackground: '#f0f8ff',
};

const SPACING = {
  xs: 5,
  sm: 8,
  md: 10,
  lg: 15,
  xl: 20,
};

const SHADOWS = {
  default: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  list: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.default,
  },
  filterButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.activeBackground,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  mealContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 100,
  },
  mealImage: {
    width: '30%',
    height: '100%',
    borderRadius: SPACING.sm,
    backgroundColor: COLORS.categoryBackground,
  },
  mealContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: SPACING.lg,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  mealDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
    flex: 1,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '900',
  },

  errorContainer: {
    backgroundColor: COLORS.errorBackground,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    marginVertical: SPACING.xl,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: SPACING.xl,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  overlaySearchContainer: {
    marginVertical: SPACING.lg,
  },
  overlaySearchBar: {
    backgroundColor: COLORS.overlay,
    borderRadius: 25,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  categoryContainer: {
    marginVertical: SPACING.lg,
    height: 130,
    width: 280,
    justifyContent: 'center',
  },
  categoryScrollView: {
    height: 130,
    flex: 1,
  },
  categoryScrollContent: {
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 1000,
    height: 130,
    gap: SPACING.md,
  },
  categoryButton: {
    backgroundColor: COLORS.categoryBackground,
    paddingHorizontal: 12,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderSecondary,
    minWidth: 70,
    maxWidth: 110,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyCategoryContainer: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCategoriesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  overlayActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
});
