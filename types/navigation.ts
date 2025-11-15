export type RootStackParamList = {
    Home: undefined;
    Meals: { dietId: number, dietName: string };
    Meal: { mealId: number };
    CreateMeal: { dietId: number, dietName: string };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}