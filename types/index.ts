export type Diet = {
  id: string;
  name: string;
  picture: string | null;
  description: string;
};

export type Meal = {
  id: string;
  name: string;
  cuisine: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  dietId?: string; // Link to diet if needed
};

export type User = {
  id: string;
  name: string;
  email: string;
  preferredDiets?: string[]; // Array of diet IDs
};