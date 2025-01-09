interface Food {
  name: string;
  calories: number;
  protein: number;
  servingSize: string;
}

export const proteins: Food[] = [
  { name: "Chicken Breast", calories: 200, protein: 25, servingSize: "100g" },
  { name: "Salmon", calories: 233, protein: 25, servingSize: "100g" },
  { name: "Tofu", calories: 144, protein: 15, servingSize: "100g" },
  { name: "Beef", calories: 250, protein: 26, servingSize: "100g" },
  { name: "Tuna Steak", calories: 184, protein: 42, servingSize: "100g" },
  { name: "Cod", calories: 105, protein: 23, servingSize: "100g" },
  { name: "Halibut", calories: 140, protein: 27, servingSize: "100g" },
  { name: "Tilapia", calories: 128, protein: 26, servingSize: "100g" },
  { name: "BBQ Ribs", calories: 360, protein: 30, servingSize: "4 oz" },
  { name: "Beef Stew", calories: 250, protein: 25, servingSize: "1 cup" },
  { name: "Pepperoni Pizza", calories: 285, protein: 12, servingSize: "1 slice" },
  { name: "Margherita Pizza", calories: 250, protein: 10, servingSize: "1 slice" },
  { name: "Beef Taco", calories: 210, protein: 11, servingSize: "1 taco" },
  { name: "Fish Taco", calories: 170, protein: 15, servingSize: "1 taco" },
  { name: "Chicken Taco", calories: 180, protein: 14, servingSize: "1 taco" },
  { name: "Shrimp", calories: 85, protein: 20, servingSize: "100g" },
  { name: "Pork Chop", calories: 242, protein: 27, servingSize: "100g" },
  { name: "Turkey Breast", calories: 165, protein: 30, servingSize: "100g" },
];

export const salads: Food[] = [
  { name: "Mixed Green Salad", calories: 70, protein: 2, servingSize: "2 cups" },
  { name: "Caesar Salad", calories: 120, protein: 4, servingSize: "2 cups" },
  { name: "Greek Salad", calories: 150, protein: 3, servingSize: "2 cups" },
  { name: "Tuna Salad", calories: 190, protein: 16, servingSize: "1 cup" },
  { name: "Chicken Caesar Salad", calories: 200, protein: 15, servingSize: "2 cups" },
  { name: "Cobb Salad", calories: 280, protein: 20, servingSize: "2 cups" },
  { name: "Chef Salad", calories: 250, protein: 18, servingSize: "2 cups" },
  { name: "Spinach Salad", calories: 80, protein: 3, servingSize: "2 cups" },
  { name: "Quinoa Salad", calories: 180, protein: 6, servingSize: "1 cup" },
  { name: "Pasta Salad", calories: 200, protein: 5, servingSize: "1 cup" },
  { name: "Potato Salad", calories: 190, protein: 3, servingSize: "1 cup" },
  { name: "Waldorf Salad", calories: 170, protein: 2, servingSize: "1 cup" },
  { name: "Caprese Salad", calories: 150, protein: 8, servingSize: "1 cup" },
  { name: "Asian Chicken Salad", calories: 220, protein: 16, servingSize: "2 cups" },
  { name: "Mediterranean Salad", calories: 160, protein: 4, servingSize: "2 cups" },
  { name: "Southwest Salad", calories: 240, protein: 12, servingSize: "2 cups" },
  { name: "Kale Caesar Salad", calories: 130, protein: 5, servingSize: "2 cups" },
  { name: "Arugula Salad", calories: 80, protein: 2, servingSize: "2 cups" },
  { name: "Chickpea Salad", calories: 180, protein: 8, servingSize: "1 cup" },
  { name: "Egg Salad", calories: 200, protein: 13, servingSize: "1 cup" },
  { name: "Seafood Salad", calories: 190, protein: 18, servingSize: "1 cup" },
  { name: "Beet Salad", calories: 120, protein: 3, servingSize: "1 cup" },
  { name: "Coleslaw", calories: 150, protein: 2, servingSize: "1 cup" },
  { name: "Bean Salad", calories: 160, protein: 7, servingSize: "1 cup" },
  { name: "Broccoli Salad", calories: 170, protein: 5, servingSize: "1 cup" },
  { name: "Cucumber Salad", calories: 90, protein: 2, servingSize: "1 cup" },
  { name: "Carrot Raisin Salad", calories: 140, protein: 2, servingSize: "1 cup" },
  { name: "Corn Salad", calories: 130, protein: 3, servingSize: "1 cup" },
  { name: "Pear Walnut Salad", calories: 160, protein: 3, servingSize: "2 cups" },
  { name: "Endive Salad", calories: 100, protein: 2, servingSize: "2 cups" },
];

export const carbs: Food[] = [
  { name: "Rice", calories: 205, protein: 4, servingSize: "1 cup cooked" },
  { name: "Pasta", calories: 220, protein: 7, servingSize: "1 cup cooked" },
  { name: "Sweet Potato", calories: 86, protein: 2, servingSize: "100g" },
];

export const fats: Food[] = [
  { name: "Avocado", calories: 234, protein: 3, servingSize: "1 medium" },
  { name: "Olive Oil", calories: 119, protein: 0, servingSize: "1 tbsp" },
  { name: "Nuts", calories: 170, protein: 6, servingSize: "1 oz" },
];

export const fruits: Food[] = [
  { name: "Apple", calories: 95, protein: 0, servingSize: "1 medium" },
  { name: "Banana", calories: 105, protein: 1, servingSize: "1 medium" },
  { name: "Orange", calories: 62, protein: 1, servingSize: "1 medium" },
  { name: "Berries", calories: 85, protein: 1, servingSize: "1 cup" },
];

export type { Food };
