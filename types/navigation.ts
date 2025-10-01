export type RootStackParamList = {
  Home: undefined;
  Meals: undefined;
  Meal: { mealId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}