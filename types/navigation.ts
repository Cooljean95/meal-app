export type RootStackParamList = {
    Home: undefined;
    Meals: { dietId: number };
    Meal: { mealId: number };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}