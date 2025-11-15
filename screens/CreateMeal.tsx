import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button, Card } from '../components';

type RootStackParamList = {
  Home: undefined;
  Meals: { dietId: number; dietName: string };
  Meal: { mealId: number };
  CreateMeal: { dietId: number; dietName: string };
};

type CreateMealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateMeal'>;
type CreateMealScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateMeal'>;

export default function CreateMeal() {
  const navigation = useNavigation<CreateMealScreenNavigationProp>();
  const route = useRoute<CreateMealScreenProps['route']>();
  const { dietId, dietName } = route.params;

  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [calories, setCalories] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      setLoading(true);

      // TODO: Implement meal creation API call
      // await MealService.createMeal({
      //     name: mealName,
      //     description,
      //     prepTime: parseInt(prepTime) || 0,
      //     calories: parseInt(calories) || 0,
      //     recipe,
      //     dietId
      // });

      Alert.alert('Success', 'Meal created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error creating meal:', error);
      Alert.alert('Error', 'Failed to create meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Are you sure you want to cancel? All changes will be lost.', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Meal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Name *</Text>
            <TextInput
              style={styles.input}
              value={mealName}
              onChangeText={setMealName}
              placeholder="Enter meal name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter meal description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Prep Time (min)</Text>
              <TextInput
                style={styles.input}
                value={prepTime}
                onChangeText={setPrepTime}
                placeholder="30"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                placeholder="400"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={recipe}
              onChangeText={setRecipe}
              placeholder="Enter recipe instructions..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={5}
            />
          </View>

          <Text style={styles.dietInfo}>
            Creating meal for: <Text style={styles.dietName}>{dietName}</Text>
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="secondary"
          size="large"
          style={styles.button}
        />
        <Button
          title={loading ? 'Creating...' : 'Create Meal'}
          onPress={handleSave}
          variant="primary"
          size="large"
          style={styles.button}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const COLORS = {
  primary: '#007AFF',
  background: '#FEF8E9',
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E5E5E5',
  inputBackground: '#F8F8F8',
  error: '#FF3B30',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  dietInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  dietName: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
  },
});
