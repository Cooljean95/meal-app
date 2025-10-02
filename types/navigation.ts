export type RootStackParamList = {
  Home: undefined;
  Meals: { dietId: string };
  Meal: { mealId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}