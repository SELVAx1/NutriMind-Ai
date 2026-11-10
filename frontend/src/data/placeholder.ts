export const mockUser = {
  name: 'Kaniska',
  email: 'kaniska@example.com',
  dietType: 'vegetarian' as const,
  budgetDaily: 200,
  region: 'South Indian',
}

export const mockDailyStats = {
  caloriesCurrent: 1240,
  caloriesTarget: 2100,
  proteinCurrent: 78,
  proteinTarget: 90,
  carbsCurrent: 135,
  carbsTarget: 180,
  fatCurrent: 42,
  fatTarget: 60,
  fibreCurrent: 19,
  fibreTarget: 30,
  budgetSpent: 136,
  budgetTotal: 200,
  nextMeal: 'lunch' as const,
}

export interface MealItem {
  id: string
  name: string
  nameTamil?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  cost: number
  prepTime: number
  tags: string[]
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  imageUrl?: string
}

export const mockTodaysMeals: MealItem[] = [
  {
    id: '1',
    name: 'Idli with sambar',
    nameTamil: 'இட்லி சாம்பார்',
    calories: 320,
    protein: 9,
    carbs: 52,
    fat: 8,
    cost: 25,
    prepTime: 10,
    tags: ['Vegetarian', 'Quick'],
    mealType: 'breakfast',
  },
  {
    id: '2',
    name: 'Lemon rice',
    nameTamil: 'எலுமிச்சை சாதம்',
    calories: 380,
    protein: 8,
    carbs: 62,
    fat: 12,
    cost: 22,
    prepTime: 15,
    tags: ['Vegan', 'Quick'],
    mealType: 'lunch',
  },
  {
    id: '3',
    name: 'Sundal',
    nameTamil: 'சுண்டல்',
    calories: 180,
    protein: 10,
    carbs: 22,
    fat: 6,
    cost: 15,
    prepTime: 10,
    tags: ['Vegan', 'High protein', 'Budget friendly'],
    mealType: 'snack',
  },
  {
    id: '4',
    name: 'Sambar rice with curd',
    nameTamil: 'சாம்பார் சாதம்',
    calories: 420,
    protein: 14,
    carbs: 65,
    fat: 10,
    cost: 32,
    prepTime: 20,
    tags: ['Vegetarian'],
    mealType: 'dinner',
  },
  {
    id: '5',
    name: 'Ragi porridge',
    nameTamil: 'ராகி கஞ்சி',
    calories: 220,
    protein: 7,
    carbs: 40,
    fat: 3,
    cost: 12,
    prepTime: 10,
    tags: ['Vegan', 'Budget friendly'],
    mealType: 'breakfast',
  },
  {
    id: '6',
    name: 'Pongal',
    nameTamil: 'பொங்கல்',
    calories: 350,
    protein: 11,
    carbs: 55,
    fat: 9,
    cost: 20,
    prepTime: 25,
    tags: ['Vegetarian'],
    mealType: 'breakfast',
  },
]

export const mockGapInsights = [
  { nutrient: 'Iron', current: 8, target: 18, unit: 'mg', color: 'var(--color-danger)' },
  { nutrient: 'Vitamin B12', current: 1.2, target: 2.4, unit: 'mcg', color: 'var(--color-warning)' },
]

export const mockRescue = {
  message: 'NutriRescue: Dinner is rebalanced after today\'s biryani.',
  detail: '76 g → 92 g protein target adjusted',
}
