export type Diet = {
    id: number;
    name: string;
    picture: string | null;
    description: string;
};

export type Meals = {
    id: number;
    name: string;
    prepTime: number;
    description: string;
    kcal: number;
    dietId: number;
};

export type Meal = {
    id: number;
    name: string;
    prepTime: number;
    ingredients: Ingredient[];
    category: Category[];
    recipe: string;
    kcal: number;
    dietId: number;
};

export type Ingredient = {
    id: number;
    name: string;
    allergens: Allergy[];
};

export type Allergy = {
    id: number;
    name: string;
};

export type Category = {
    id: number;
    name: string;
};
