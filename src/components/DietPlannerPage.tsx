import { useState } from 'react';
import { User } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RecipeDialog, Recipe } from './RecipeDialog';
import { FoodTracker } from './FoodTracker';
import { 
  Utensils, 
  Coffee, 
  Sun, 
  Moon as MoonIcon, 
  Apple,
  Droplet,
  Flame,
  Timer,
  RefreshCw,
  ChefHat
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DietPlannerPageProps {
  user: User;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  ingredients: string[];
  benefits: string;
  prepTime: number;
  image: string;
  recipe: Recipe;
}

interface MealPlan {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

export function DietPlannerPage({ user }: DietPlannerPageProps) {
  const [selectedDay, setSelectedDay] = useState('day1');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('meal-plans');

  const getRiskBasedRecommendations = () => {
    const riskScore = user.riskScore || 50;
    
    if (riskScore < 25) {
      return {
        title: 'Maintenance Diet Plan',
        description: 'Keep your healthy lifestyle with balanced, nutrient-rich Indian meals',
        carbLimit: '45-60% of calories',
        focus: 'Whole grains, lean proteins, healthy fats'
      };
    } else if (riskScore < 50) {
      return {
        title: 'Prevention Diet Plan',
        description: 'Reduce your risk with diabetes-preventive Indian nutrition',
        carbLimit: '40-50% of calories',
        focus: 'Low glycemic foods, high fiber, portion control'
      };
    } else if (riskScore < 75) {
      return {
        title: 'Risk Reduction Diet Plan',
        description: 'Aggressive nutrition strategy with traditional Indian foods',
        carbLimit: '35-45% of calories',
        focus: 'Very low glycemic index, maximum fiber, minimal processed foods'
      };
    } else {
      return {
        title: 'Intensive Diet Plan',
        description: 'Strict nutritional guidelines for high-risk individuals',
        carbLimit: '30-40% of calories',
        focus: 'Traditional healthy Indian diet, no refined sugars, high vegetables'
      };
    }
  };

  const recommendations = getRiskBasedRecommendations();

  // Generate meal plans based on risk score with Indian foods
  const mealPlans: Record<string, MealPlan> = {
    day1: {
      breakfast: [
        {
          name: 'Masala Dosa with Sambar',
          calories: 320,
          protein: 12,
          carbs: 48,
          fiber: 8,
          ingredients: ['Rice', 'Urad dal', 'Potato', 'Onion', 'Green chilli', 'Sambar'],
          benefits: 'Fermented food aids digestion, low glycemic index, high fiber',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1708146464361-5c5ce4f9abb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNhbGElMjBkb3NhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Masala Dosa with Sambar',
            image: 'https://images.unsplash.com/photo-1708146464361-5c5ce4f9abb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNhbGElMjBkb3NhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 2,
            calories: 320,
            steps: [
              'Prepare dosa batter by soaking rice and urad dal overnight, then grinding into smooth paste',
              'For filling, boil potatoes and mash. Sauté onions, green chillies, curry leaves with mustard seeds',
              'Mix mashed potatoes with sautéed spices and turmeric',
              'Heat dosa tawa, spread thin layer of batter in circular motion',
              'Add potato filling in center, fold dosa and serve hot with sambar and coconut chutney'
            ],
            tips: 'Use minimal oil and opt for non-stick tawa. Fermented batter is easier to digest.',
            youtubeLink: 'https://www.youtube.com/results?search_query=masala+dosa+recipe'
          }
        },
        {
          name: 'Poha (Flattened Rice)',
          calories: 280,
          protein: 8,
          carbs: 45,
          fiber: 6,
          ingredients: ['Poha', 'Peanuts', 'Curry leaves', 'Turmeric', 'Lemon', 'Coriander'],
          benefits: 'Light on stomach, easy to digest, rich in iron',
          prepTime: 15,
          image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb2hhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Poha (Flattened Rice)',
            image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb2hhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 15,
            servings: 2,
            calories: 280,
            steps: [
              'Rinse poha in water and drain immediately to avoid mushiness',
              'Heat oil, add mustard seeds, curry leaves, peanuts',
              'Add chopped onions, green chillies, sauté until translucent',
              'Add turmeric, salt, and drained poha. Mix gently',
              'Cook for 2-3 minutes, garnish with coriander and lemon juice'
            ],
            tips: 'Don\'t soak poha for too long. Just rinse and drain quickly for best texture.',
            youtubeLink: 'https://www.youtube.com/results?search_query=poha+recipe+indian'
          }
        },
        {
          name: 'Idli with Sambar',
          calories: 250,
          protein: 10,
          carbs: 42,
          fiber: 7,
          ingredients: ['Rice', 'Urad dal', 'Sambar dal', 'Vegetables', 'Tamarind', 'Spices'],
          benefits: 'Steamed, low fat, probiotic-rich fermented food',
          prepTime: 20,
          image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjE0MTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Idli with Sambar',
            image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjE0MTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 20,
            servings: 4,
            calories: 250,
            steps: [
              'Prepare idli batter with fermented rice and urad dal mixture',
              'Grease idli molds with little oil',
              'Pour batter into molds and steam for 10-12 minutes',
              'For sambar: Cook toor dal with vegetables like drumstick, tomato, onion',
              'Add tamarind water, sambar powder and temper with mustard seeds'
            ],
            tips: 'Properly fermented batter makes soft idlis. Keep batter in warm place for 8-12 hours.',
            youtubeLink: 'https://www.youtube.com/results?search_query=idli+sambar+recipe'
          }
        }
      ],
      lunch: [
        {
          name: 'Dal Tadka with Brown Rice',
          calories: 420,
          protein: 18,
          carbs: 52,
          fiber: 12,
          ingredients: ['Toor dal', 'Brown rice', 'Tomato', 'Onion', 'Garlic', 'Cumin', 'Ghee'],
          benefits: 'Complete protein, high fiber, low glycemic index',
          prepTime: 35,
          image: 'https://images.unsplash.com/photo-1734770931927-6410f9a64832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYSUyMGN1cnJ5fGVufDF8fHx8MTc2MjI2NzkxNnww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Dal Tadka with Brown Rice',
            image: 'https://images.unsplash.com/photo-1734770931927-6410f9a64832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYSUyMGN1cnJ5fGVufDF8fHx8MTc2MjI2NzkxNnww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 35,
            servings: 3,
            calories: 420,
            steps: [
              'Pressure cook toor dal with turmeric until soft and mushy',
              'Cook brown rice separately (takes 30-40 minutes)',
              'In a pan, heat ghee and add cumin seeds, dried red chillies',
              'Add chopped onions, garlic, tomatoes and sauté',
              'Pour tempering over cooked dal, add salt and garnish with coriander'
            ],
            tips: 'Brown rice has lower glycemic index than white rice. Soak it for 30 minutes before cooking.',
            youtubeLink: 'https://www.youtube.com/results?search_query=dal+tadka+brown+rice+recipe'
          }
        },
        {
          name: 'Palak Paneer with Roti',
          calories: 380,
          protein: 20,
          carbs: 35,
          fiber: 8,
          ingredients: ['Spinach', 'Paneer', 'Whole wheat', 'Onion', 'Tomato', 'Ginger-garlic'],
          benefits: 'Rich in iron, calcium, protein, and fiber',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1547058606-7eb25508e7e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhayUyMHBhbmVlciUyMHNwaW5hY2h8ZW58MXx8fHwxNzYyMjYxMTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Palak Paneer with Roti',
            image: 'https://images.unsplash.com/photo-1547058606-7eb25508e7e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhayUyMHBhbmVlciUyMHNwaW5hY2h8ZW58MXx8fHwxNzYyMjYxMTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 3,
            calories: 380,
            steps: [
              'Blanch spinach in hot water, then blend to smooth paste',
              'Cut paneer into cubes and lightly fry or use directly',
              'Make gravy with onion-tomato paste, ginger-garlic, spices',
              'Add spinach puree and paneer cubes, simmer for 5 minutes',
              'For roti: Knead whole wheat flour, roll and cook on hot tawa'
            ],
            tips: 'Use low-fat paneer or tofu for lower calories. Add cream only if needed.',
            youtubeLink: 'https://www.youtube.com/results?search_query=palak+paneer+recipe'
          }
        },
        {
          name: 'Chole (Chickpea Curry) with Roti',
          calories: 410,
          protein: 16,
          carbs: 58,
          fiber: 14,
          ingredients: ['Chickpeas', 'Whole wheat flour', 'Tomato', 'Onion', 'Chole masala', 'Tea bag'],
          benefits: 'Very high fiber, plant-based protein, low glycemic',
          prepTime: 40,
          image: 'https://images.unsplash.com/flagged/photo-1579386471443-9efb1386486c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9sZSUyMGNoaWNrcGVhJTIwY3Vycnl8ZW58MXx8fHwxNzYyMjY3OTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Chole (Chickpea Curry)',
            image: 'https://images.unsplash.com/flagged/photo-1579386471443-9efb1386486c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9sZSUyMGNoaWNrcGVhJTIwY3Vycnl8ZW58MXx8fHwxNzYyMjY3OTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 40,
            servings: 4,
            calories: 410,
            steps: [
              'Soak chickpeas overnight, pressure cook with tea bag for dark color',
              'Prepare masala base with onion-tomato gravy, add chole masala',
              'Add cooked chickpeas to gravy, simmer for 15 minutes',
              'Garnish with ginger julienne and coriander',
              'Serve with whole wheat roti'
            ],
            tips: 'Tea bag gives authentic dark color to chole. Pressure cook well for easy digestion.',
            youtubeLink: 'https://www.youtube.com/results?search_query=chole+masala+recipe'
          }
        }
      ],
      dinner: [
        {
          name: 'Vegetable Biryani (Low Oil)',
          calories: 380,
          protein: 12,
          carbs: 62,
          fiber: 9,
          ingredients: ['Basmati rice', 'Mixed vegetables', 'Yogurt', 'Biryani spices', 'Mint', 'Saffron'],
          benefits: 'Balanced meal, aromatic spices aid digestion',
          prepTime: 45,
          image: 'https://images.unsplash.com/photo-1752673508949-f4aeeaef75f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMGRpc2h8ZW58MXx8fHwxNzYyMjY2NDUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Vegetable Biryani (Low Oil)',
            image: 'https://images.unsplash.com/photo-1752673508949-f4aeeaef75f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwcmljZSUyMGRpc2h8ZW58MXx8fHwxNzYyMjY2NDUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 45,
            servings: 4,
            calories: 380,
            steps: [
              'Soak basmati rice for 30 minutes, partially cook with whole spices',
              'Sauté mixed vegetables (carrots, beans, peas, potatoes) with minimal oil',
              'Layer rice and vegetables with yogurt, mint, and saffron milk',
              'Cover and cook on dum (slow steam) for 20 minutes',
              'Garnish with fried onions and serve with raita'
            ],
            tips: 'Use brown basmati for lower glycemic index. Avoid heavy cream and excess oil.',
            youtubeLink: 'https://www.youtube.com/results?search_query=vegetable+biryani+healthy'
          }
        },
        {
          name: 'Tandoori Chicken with Salad',
          calories: 350,
          protein: 38,
          carbs: 18,
          fiber: 6,
          ingredients: ['Chicken breast', 'Yogurt', 'Tandoori masala', 'Lemon', 'Mixed salad', 'Cucumber'],
          benefits: 'High protein, low carb, grilled preparation',
          prepTime: 35,
          image: 'https://images.unsplash.com/photo-1727280376746-b89107a5b0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW5kb29yaSUyMGNoaWNrZW58ZW58MXx8fHwxNzYyMTczODk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Tandoori Chicken with Salad',
            image: 'https://images.unsplash.com/photo-1727280376746-b89107a5b0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW5kb29yaSUyMGNoaWNrZW58ZW58MXx8fHwxNzYyMTczODk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 35,
            servings: 3,
            calories: 350,
            steps: [
              'Marinate chicken pieces in yogurt, tandoori masala, ginger-garlic paste for 2 hours',
              'Grill or bake in oven at 200°C for 25-30 minutes',
              'Turn pieces halfway for even cooking',
              'Prepare fresh salad with cucumber, tomato, onion, lettuce',
              'Serve tandoori chicken with salad and mint chutney'
            ],
            tips: 'Remove chicken skin for lower fat. Can be cooked in air fryer for healthier option.',
            youtubeLink: 'https://www.youtube.com/results?search_query=tandoori+chicken+recipe'
          }
        },
        {
          name: 'Rajma (Kidney Beans) with Rice',
          calories: 390,
          protein: 16,
          carbs: 58,
          fiber: 13,
          ingredients: ['Kidney beans', 'Rice', 'Tomato', 'Onion', 'Rajma masala', 'Ginger-garlic'],
          benefits: 'High fiber, complete protein when paired with rice',
          prepTime: 40,
          image: 'https://images.unsplash.com/photo-1762111249859-5f77c160f8e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWptYSUyMGN1cnJ5JTIwYmVhbnN8ZW58MXx8fHwxNzYyMjY3OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Rajma (Kidney Beans) with Rice',
            image: 'https://images.unsplash.com/photo-1762111249859-5f77c160f8e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWptYSUyMGN1cnJ5JTIwYmVhbnN8ZW58MXx8fHwxNzYyMjY3OTE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 40,
            servings: 4,
            calories: 390,
            steps: [
              'Soak rajma overnight, pressure cook until soft',
              'Prepare onion-tomato gravy with ginger-garlic paste',
              'Add rajma masala, red chilli powder, cumin powder',
              'Add cooked rajma to gravy, simmer for 15-20 minutes',
              'Serve with steamed rice and garnish with coriander'
            ],
            tips: 'Soaking beans overnight reduces cooking time and improves digestibility.',
            youtubeLink: 'https://www.youtube.com/results?search_query=rajma+chawal+recipe'
          }
        }
      ]
    },
    day2: {
      breakfast: [
        {
          name: 'Upma with Vegetables',
          calories: 280,
          protein: 10,
          carbs: 42,
          fiber: 7,
          ingredients: ['Semolina', 'Mixed vegetables', 'Mustard seeds', 'Curry leaves', 'Peanuts'],
          benefits: 'Light, easy to digest, loaded with vegetables',
          prepTime: 20,
          image: 'https://images.unsplash.com/photo-1566237242515-8540394e1993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cG1hJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzYyMjY3OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Upma with Vegetables',
            image: 'https://images.unsplash.com/photo-1566237242515-8540394e1993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cG1hJTIwc291dGglMjBpbmRpYW58ZW58MXx8fHwxNzYyMjY3OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 20,
            servings: 2,
            calories: 280,
            steps: [
              'Dry roast semolina (rava) until fragrant',
              'In a pan, heat oil and add mustard seeds, curry leaves, peanuts',
              'Add chopped onions, green chillies, mixed vegetables',
              'Add water (1:2 ratio with rava), bring to boil',
              'Add roasted rava slowly while stirring, cook until water is absorbed'
            ],
            tips: 'Use whole wheat rava for more fiber. Add lots of vegetables for nutrition.',
            youtubeLink: 'https://www.youtube.com/results?search_query=upma+recipe+south+indian'
          }
        },
        {
          name: 'Vegetable Paratha with Curd',
          calories: 320,
          protein: 12,
          carbs: 48,
          fiber: 8,
          ingredients: ['Whole wheat flour', 'Cauliflower', 'Carrot', 'Peas', 'Curd', 'Spices'],
          benefits: 'Stuffed with vegetables, probiotic-rich curd',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1754394483922-4d3a10cc6187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhdGhhJTIwaW5kaWFuJTIwZmxhdGJyZWFkfGVufDF8fHx8MTc2MjI2NzkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Vegetable Paratha with Curd',
            image: 'https://images.unsplash.com/photo-1754394483922-4d3a10cc6187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhdGhhJTIwaW5kaWFuJTIwZmxhdGJyZWFkfGVufDF8fHx8MTc2MjI2NzkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 3,
            calories: 320,
            steps: [
              'Grate cauliflower, carrot and cook with minimal water',
              'Squeeze out water and mix with spices',
              'Knead whole wheat dough, divide into balls',
              'Stuff each ball with vegetable mixture, roll flat',
              'Cook on hot tawa with minimal ghee until golden. Serve with curd'
            ],
            tips: 'Remove excess water from vegetables to prevent soggy parathas.',
            youtubeLink: 'https://www.youtube.com/results?search_query=vegetable+paratha+recipe'
          }
        },
        {
          name: 'Moong Dal Cheela',
          calories: 260,
          protein: 14,
          carbs: 38,
          fiber: 9,
          ingredients: ['Moong dal', 'Onion', 'Tomato', 'Ginger', 'Green chilli', 'Coriander'],
          benefits: 'High protein, easy to digest, savory pancake',
          prepTime: 25,
          image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb2hhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Moong Dal Cheela',
            image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb2hhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 25,
            servings: 3,
            calories: 260,
            steps: [
              'Soak moong dal for 4-5 hours, grind to smooth batter',
              'Add chopped onion, tomato, ginger, green chilli to batter',
              'Add salt, cumin seeds, coriander leaves',
              'Heat non-stick pan, pour ladle of batter and spread',
              'Cook both sides until golden, serve with green chutney'
            ],
            tips: 'Batter should be of pouring consistency. Add vegetables for extra nutrition.',
            youtubeLink: 'https://www.youtube.com/results?search_query=moong+dal+cheela+recipe'
          }
        }
      ],
      lunch: [
        {
          name: 'Paneer Tikka with Mint Chutney',
          calories: 360,
          protein: 24,
          carbs: 22,
          fiber: 5,
          ingredients: ['Paneer', 'Bell peppers', 'Yogurt', 'Tikka masala', 'Mint', 'Coriander'],
          benefits: 'High protein, grilled preparation, flavorful',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Paneer Tikka with Mint Chutney',
            image: 'https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 3,
            calories: 360,
            steps: [
              'Cut paneer and bell peppers into cubes',
              'Marinate in yogurt, tikka masala, ginger-garlic paste for 1 hour',
              'Thread onto skewers alternating paneer and vegetables',
              'Grill or bake at 200°C for 15-20 minutes',
              'Serve with mint-coriander chutney and onion rings'
            ],
            tips: 'Use low-fat paneer. Can be cooked in air fryer for oil-free version.',
            youtubeLink: 'https://www.youtube.com/results?search_query=paneer+tikka+recipe'
          }
        },
        {
          name: 'Mixed Vegetable Curry with Chapati',
          calories: 380,
          protein: 14,
          carbs: 52,
          fiber: 11,
          ingredients: ['Carrots', 'Beans', 'Peas', 'Potato', 'Tomato gravy', 'Whole wheat flour'],
          benefits: 'Nutrient-dense, variety of vegetables, fiber-rich',
          prepTime: 35,
          image: 'https://images.unsplash.com/photo-1595959524165-0d395008e55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Mixed Vegetable Curry',
            image: 'https://images.unsplash.com/photo-1595959524165-0d395008e55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 35,
            servings: 4,
            calories: 380,
            steps: [
              'Chop mixed vegetables (carrots, beans, peas, cauliflower, potato)',
              'Prepare tomato-onion gravy with ginger-garlic paste',
              'Add vegetables, garam masala, coriander powder, turmeric',
              'Cook until vegetables are tender',
              'Serve with whole wheat chapati'
            ],
            tips: 'Use seasonal vegetables for best nutrition. Avoid overcooking to retain nutrients.',
            youtubeLink: 'https://www.youtube.com/results?search_query=mixed+vegetable+curry+recipe'
          }
        },
        {
          name: 'Khichdi with Vegetables',
          calories: 340,
          protein: 12,
          carbs: 56,
          fiber: 10,
          ingredients: ['Rice', 'Moong dal', 'Mixed vegetables', 'Turmeric', 'Cumin', 'Ghee'],
          benefits: 'Easy to digest, complete protein, comfort food',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1630409351211-d62ab2d24da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGljaGRpJTIwcmljZSUyMGxlbnRpbHxlbnwxfHx8fDE3NjIyNjc5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Khichdi with Vegetables',
            image: 'https://images.unsplash.com/photo-1630409351211-d62ab2d24da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGljaGRpJTIwcmljZSUyMGxlbnRpbHxlbnwxfHx8fDE3NjIyNjc5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 3,
            calories: 340,
            steps: [
              'Wash rice and moong dal together',
              'Pressure cook with chopped vegetables, turmeric, salt',
              'In a separate pan, heat ghee and add cumin seeds',
              'Pour tempering over khichdi',
              'Serve hot with curd or pickle'
            ],
            tips: 'Khichdi is Ayurvedic healing food. Add more vegetables for nutrition.',
            youtubeLink: 'https://www.youtube.com/results?search_query=vegetable+khichdi+recipe'
          }
        }
      ],
      dinner: [
        {
          name: 'Aloo Gobi with Chapati',
          calories: 350,
          protein: 11,
          carbs: 54,
          fiber: 10,
          ingredients: ['Cauliflower', 'Potato', 'Tomato', 'Turmeric', 'Whole wheat flour', 'Spices'],
          benefits: 'Low calorie, high fiber, antioxidant-rich',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1627785097692-c98adf1acd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9vJTIwZ29iaSUyMGNhdWxpZmxvd2VyfGVufDF8fHx8MTc2MjI2NzkyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Aloo Gobi with Chapati',
            image: 'https://images.unsplash.com/photo-1627785097692-c98adf1acd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9vJTIwZ29iaSUyMGNhdWxpZmxvd2VyfGVufDF8fHx8MTc2MjI2NzkyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 3,
            calories: 350,
            steps: [
              'Cut cauliflower into florets, potatoes into cubes',
              'Heat oil, add cumin seeds, then add vegetables',
              'Add turmeric, coriander powder, salt and cook covered',
              'Stir occasionally until vegetables are tender',
              'Serve with whole wheat chapati and curd'
            ],
            tips: 'Don\'t add water - vegetables cook in their own moisture. Use minimal oil.',
            youtubeLink: 'https://www.youtube.com/results?search_query=aloo+gobi+recipe'
          }
        },
        {
          name: 'Masoor Dal with Jeera Rice',
          calories: 370,
          protein: 16,
          carbs: 58,
          fiber: 12,
          ingredients: ['Red lentils', 'Basmati rice', 'Cumin', 'Onion', 'Tomato', 'Garlic'],
          benefits: 'High protein, iron-rich, easily digestible',
          prepTime: 30,
          image: 'https://images.unsplash.com/photo-1734770931927-6410f9a64832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYSUyMGN1cnJ5fGVufDF8fHx8MTc2MjI2NzkxNnww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Masoor Dal with Jeera Rice',
            image: 'https://images.unsplash.com/photo-1734770931927-6410f9a64832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYSUyMGN1cnJ5fGVufDF8fHx8MTc2MjI2NzkxNnww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 30,
            servings: 3,
            calories: 370,
            steps: [
              'Pressure cook masoor dal with turmeric until soft',
              'Temper with cumin, garlic, onions, tomatoes',
              'For jeera rice: Cook basmati rice, temper with cumin',
              'Mix tempered rice together',
              'Serve dal and jeera rice together'
            ],
            tips: 'Masoor dal cooks faster than other lentils. Rich in iron and protein.',
            youtubeLink: 'https://www.youtube.com/results?search_query=masoor+dal+jeera+rice'
          }
        },
        {
          name: 'Paneer Bhurji with Roti',
          calories: 380,
          protein: 22,
          carbs: 36,
          fiber: 7,
          ingredients: ['Paneer', 'Onion', 'Tomato', 'Capsicum', 'Whole wheat flour', 'Spices'],
          benefits: 'High protein, scrambled style paneer',
          prepTime: 25,
          image: 'https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Paneer Bhurji with Roti',
            image: 'https://images.unsplash.com/photo-1708793873401-e8c6c153b76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 25,
            servings: 2,
            calories: 380,
            steps: [
              'Crumble paneer into small pieces',
              'Sauté onions, tomatoes, capsicum with ginger-garlic',
              'Add crumbled paneer, turmeric, red chilli, garam masala',
              'Cook for 5-7 minutes, garnish with coriander',
              'Serve with whole wheat roti'
            ],
            tips: 'Use low-fat paneer to reduce calories. Great protein-rich dinner option.',
            youtubeLink: 'https://www.youtube.com/results?search_query=paneer+bhurji+recipe'
          }
        }
      ]
    },
    day3: {
      breakfast: [
        {
          name: 'Besan Cheela (Chickpea Pancake)',
          calories: 270,
          protein: 14,
          carbs: 38,
          fiber: 8,
          ingredients: ['Besan', 'Onion', 'Tomato', 'Green chilli', 'Coriander', 'Spices'],
          benefits: 'High protein, gluten-free, savory pancake',
          prepTime: 20,
          image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb2hhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Besan Cheela',
            image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb2hhJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjI2NzkxNXww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 20,
            servings: 3,
            calories: 270,
            steps: [
              'Mix besan with water to make thin batter',
              'Add chopped onion, tomato, green chilli, coriander',
              'Add salt, turmeric, red chilli powder',
              'Heat non-stick pan, pour batter and spread thin',
              'Cook both sides until golden, serve with chutney'
            ],
            tips: 'Besan is high in protein and gluten-free. Perfect breakfast option.',
            youtubeLink: 'https://www.youtube.com/results?search_query=besan+cheela+recipe'
          }
        },
        {
          name: 'Oats Idli',
          calories: 240,
          protein: 11,
          carbs: 38,
          fiber: 9,
          ingredients: ['Oats', 'Semolina', 'Yogurt', 'Carrot', 'Curry leaves', 'Mustard seeds'],
          benefits: 'High fiber, instant version, heart-healthy',
          prepTime: 15,
          image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjE0MTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Oats Idli',
            image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjE0MTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 15,
            servings: 3,
            calories: 240,
            steps: [
              'Powder oats in blender, mix with semolina',
              'Add yogurt, grated carrot, salt and make batter',
              'Add fruit salt or eno just before steaming',
              'Pour into greased idli molds',
              'Steam for 10-12 minutes, serve with chutney'
            ],
            tips: 'Instant healthy breakfast. Oats provide soluble fiber good for heart.',
            youtubeLink: 'https://www.youtube.com/results?search_query=oats+idli+recipe'
          }
        },
        {
          name: 'Methi Thepla',
          calories: 290,
          protein: 10,
          carbs: 44,
          fiber: 7,
          ingredients: ['Whole wheat flour', 'Fenugreek leaves', 'Yogurt', 'Spices', 'Sesame seeds'],
          benefits: 'Fenugreek helps blood sugar control',
          prepTime: 25,
          image: 'https://images.unsplash.com/photo-1754394483922-4d3a10cc6187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhdGhhJTIwaW5kaWFuJTIwZmxhdGJyZWFkfGVufDF8fHx8MTc2MjI2NzkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Methi Thepla',
            image: 'https://images.unsplash.com/photo-1754394483922-4d3a10cc6187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhdGhhJTIwaW5kaWFuJTIwZmxhdGJyZWFkfGVufDF8fHx8MTc2MjI2NzkxOXww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 25,
            servings: 4,
            calories: 290,
            steps: [
              'Chop fenugreek leaves finely',
              'Mix with whole wheat flour, yogurt, turmeric, chilli powder',
              'Add sesame seeds and knead soft dough',
              'Roll into thin circles and cook on hot tawa',
              'Serve with pickle or yogurt'
            ],
            tips: 'Fenugreek (methi) is excellent for diabetes management. Theplas stay fresh for days.',
            youtubeLink: 'https://www.youtube.com/results?search_query=methi+thepla+recipe'
          }
        }
      ],
      lunch: [
        {
          name: 'Spinach Dal with Roti',
          calories: 370,
          protein: 18,
          carbs: 52,
          fiber: 13,
          ingredients: ['Spinach', 'Moong dal', 'Whole wheat flour', 'Garlic', 'Cumin', 'Tomato'],
          benefits: 'Iron-rich, high protein, nutrient-dense',
          prepTime: 35,
          image: 'https://images.unsplash.com/photo-1734770931927-6410f9a64832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYSUyMGN1cnJ5fGVufDF8fHx8MTc2MjI2NzkxNnww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Spinach Dal with Roti',
            image: 'https://images.unsplash.com/photo-1734770931927-6410f9a64832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWwlMjB0YWRrYSUyMGN1cnJ5fGVufDF8fHx8MTc2MjI2NzkxNnww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 35,
            servings: 3,
            calories: 370,
            steps: [
              'Pressure cook moong dal with chopped spinach and turmeric',
              'Prepare tomato-based tempering with cumin, garlic',
              'Mix dal and tempering together',
              'Make whole wheat roti',
              'Serve hot dal with roti'
            ],
            tips: 'Spinach adds iron and vitamins to dal. Pairs perfectly with roti.',
            youtubeLink: 'https://www.youtube.com/results?search_query=palak+dal+recipe'
          }
        },
        {
          name: 'Stuffed Capsicum (Bharwan Shimla Mirch)',
          calories: 340,
          protein: 14,
          carbs: 46,
          fiber: 9,
          ingredients: ['Bell peppers', 'Paneer', 'Potato', 'Peas', 'Spices', 'Roti'],
          benefits: 'Low calorie, vitamin C rich, satisfying',
          prepTime: 40,
          image: 'https://images.unsplash.com/photo-1595959524165-0d395008e55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Stuffed Capsicum',
            image: 'https://images.unsplash.com/photo-1595959524165-0d395008e55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 40,
            servings: 3,
            calories: 340,
            steps: [
              'Cut tops of bell peppers and remove seeds',
              'Prepare filling with mashed potato, crumbled paneer, peas, spices',
              'Stuff bell peppers with filling mixture',
              'Cook in tomato gravy or bake in oven',
              'Serve with roti'
            ],
            tips: 'Bell peppers are rich in vitamin C. Baking is healthier than frying.',
            youtubeLink: 'https://www.youtube.com/results?search_query=bharwan+shimla+mirch+recipe'
          }
        },
        {
          name: 'Sambhar with Brown Rice',
          calories: 390,
          protein: 14,
          carbs: 62,
          fiber: 11,
          ingredients: ['Toor dal', 'Mixed vegetables', 'Tamarind', 'Sambhar powder', 'Brown rice'],
          benefits: 'South Indian staple, probiotic spices, low GI',
          prepTime: 40,
          image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjE0MTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Sambhar with Brown Rice',
            image: 'https://images.unsplash.com/photo-1644289450169-bc58aa16bacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpZGxpJTIwc2FtYmFyJTIwYnJlYWtmYXN0fGVufDF8fHx8MTc2MjE0MTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 40,
            servings: 4,
            calories: 390,
            steps: [
              'Pressure cook toor dal until soft',
              'Cook mixed vegetables (drumstick, carrots, beans) separately',
              'Add tamarind water, sambhar powder, salt to dal',
              'Add cooked vegetables and simmer',
              'Temper with mustard seeds, curry leaves. Serve with brown rice'
            ],
            tips: 'Sambhar is complete nutrition. Brown rice has lower glycemic index.',
            youtubeLink: 'https://www.youtube.com/results?search_query=sambhar+recipe+south+indian'
          }
        }
      ],
      dinner: [
        {
          name: 'Methi Chicken (Low Oil)',
          calories: 360,
          protein: 36,
          carbs: 24,
          fiber: 6,
          ingredients: ['Chicken', 'Fenugreek leaves', 'Yogurt', 'Tomato', 'Spices', 'Roti'],
          benefits: 'High protein, fenugreek aids diabetes control',
          prepTime: 35,
          image: 'https://images.unsplash.com/photo-1727280376746-b89107a5b0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW5kb29yaSUyMGNoaWNrZW58ZW58MXx8fHwxNzYyMTczODk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Methi Chicken (Low Oil)',
            image: 'https://images.unsplash.com/photo-1727280376746-b89107a5b0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW5kb29yaSUyMGNoaWNrZW58ZW58MXx8fHwxNzYyMTczODk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 35,
            servings: 3,
            calories: 360,
            steps: [
              'Marinate chicken in yogurt, ginger-garlic paste',
              'Cook chicken with minimal oil until half done',
              'Add chopped fenugreek leaves, tomatoes, spices',
              'Cook until chicken is tender and gravy thickens',
              'Serve with whole wheat roti'
            ],
            tips: 'Fenugreek helps lower blood sugar. Remove chicken skin for less fat.',
            youtubeLink: 'https://www.youtube.com/results?search_query=methi+chicken+recipe'
          }
        },
        {
          name: 'Baingan Bharta with Roti',
          calories: 330,
          protein: 10,
          carbs: 52,
          fiber: 12,
          ingredients: ['Eggplant', 'Tomato', 'Onion', 'Peas', 'Whole wheat flour', 'Spices'],
          benefits: 'Low calorie, high fiber, smoky flavor',
          prepTime: 40,
          image: 'https://images.unsplash.com/photo-1595959524165-0d395008e55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Baingan Bharta with Roti',
            image: 'https://images.unsplash.com/photo-1595959524165-0d395008e55b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBjdXJyeSUyMGluZGlhbnxlbnwxfHx8fDE3NjIyNjc5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 40,
            servings: 3,
            calories: 330,
            steps: [
              'Roast eggplant on open flame or in oven until skin chars',
              'Peel and mash the roasted eggplant',
              'Sauté onions, tomatoes, green chillies',
              'Add mashed eggplant, peas, spices and cook',
              'Serve with whole wheat roti'
            ],
            tips: 'Roasting gives smoky flavor. Eggplant is low in calories and high in fiber.',
            youtubeLink: 'https://www.youtube.com/results?search_query=baingan+bharta+recipe'
          }
        },
        {
          name: 'Moong Dal Khichdi with Curd',
          calories: 340,
          protein: 14,
          carbs: 54,
          fiber: 10,
          ingredients: ['Moong dal', 'Rice', 'Mixed vegetables', 'Cumin', 'Turmeric', 'Curd'],
          benefits: 'Comfort food, easy to digest, complete meal',
          prepTime: 25,
          image: 'https://images.unsplash.com/photo-1630409351211-d62ab2d24da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGljaGRpJTIwcmljZSUyMGxlbnRpbHxlbnwxfHx8fDE3NjIyNjc5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
          recipe: {
            name: 'Moong Dal Khichdi',
            image: 'https://images.unsplash.com/photo-1630409351211-d62ab2d24da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGljaGRpJTIwcmljZSUyMGxlbnRpbHxlbnwxfHx8fDE3NjIyNjc5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
            prepTime: 25,
            servings: 3,
            calories: 340,
            steps: [
              'Wash moong dal and rice together',
              'Pressure cook with vegetables, turmeric, ginger',
              'Temper with cumin seeds and ghee',
              'Mash slightly for creamy texture',
              'Serve hot with curd and papad'
            ],
            tips: 'Ayurvedic healing food. Light on stomach, perfect for dinner.',
            youtubeLink: 'https://www.youtube.com/results?search_query=moong+dal+khichdi+recipe'
          }
        }
      ]
    }
  };

  const currentPlan = mealPlans[selectedDay];

  const handleRegeneratePlan = () => {
    toast.success('New meal plan generated! 🎉');
  };

  const handleMealClick = (meal: Meal) => {
    setSelectedRecipe(meal.recipe);
    setRecipeDialogOpen(true);
  };

  const renderMealCard = (meal: Meal) => (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-300 group bg-gradient-to-br from-white to-orange-50/20"
      onClick={() => handleMealClick(meal)}
    >
      {/* Meal Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={meal.image} 
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white mb-1">{meal.name}</h4>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0">
              <Timer className="w-3 h-3 mr-1" />
              {meal.prepTime} min
            </Badge>
            <Badge className="bg-purple-600/90 text-white backdrop-blur-sm border-0">
              <Flame className="w-3 h-3 mr-1" />
              {meal.calories} cal
            </Badge>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <ChefHat className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Meal Info */}
      <div className="p-6 space-y-4">
        {/* Nutrition Info */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center border-2 border-blue-200">
            <p className="text-xs text-gray-600">Protein</p>
            <p className="text-blue-700">{meal.protein}g</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center border-2 border-green-200">
            <p className="text-xs text-gray-600">Carbs</p>
            <p className="text-green-700">{meal.carbs}g</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 text-center border-2 border-orange-200">
            <p className="text-xs text-gray-600">Fiber</p>
            <p className="text-orange-700">{meal.fiber}g</p>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <p className="text-sm mb-2 text-gray-600">Key Ingredients:</p>
          <div className="flex flex-wrap gap-1.5">
            {meal.ingredients.slice(0, 4).map((ingredient, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                {ingredient}
              </Badge>
            ))}
            {meal.ingredients.length > 4 && (
              <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                +{meal.ingredients.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200">
          <div className="flex gap-2">
            <Apple className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{meal.benefits}</p>
          </div>
        </div>

        {/* Click for Recipe */}
        <div className="pt-2 border-t-2 border-dashed border-purple-200">
          <p className="text-center text-sm text-purple-600 group-hover:text-purple-700 flex items-center justify-center gap-2">
            <span className="text-lg">👆</span>
            Click to view full recipe
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            🍛 Personalized Indian Diet Planner
          </h2>
          <p className="text-gray-600">
            Customized Indian meal plans based on your diabetes risk profile
          </p>
        </div>

        {/* Tabs for Meal Plans and Food Tracker */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gradient-to-r from-purple-100 to-pink-100 p-1">
            <TabsTrigger value="meal-plans" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              📋 Meal Plans
            </TabsTrigger>
            <TabsTrigger value="food-tracker" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              📊 Food Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meal-plans" className="space-y-8">
            {/* Risk-Based Recommendations */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">{recommendations.title}</h3>
                  <p className="text-gray-600 mb-4">{recommendations.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3 border border-purple-200">
                      <Droplet className="w-5 h-5 text-blue-600" />
                      <span><strong>Carbohydrate target:</strong> {recommendations.carbLimit}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3 border border-purple-200">
                      <Apple className="w-5 h-5 text-green-600" />
                      <span><strong>Focus:</strong> {recommendations.focus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Day Selection & Regenerate */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                <TabsList className="bg-gradient-to-r from-purple-100 to-pink-100 p-1">
                  <TabsTrigger value="day1" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    Day 1
                  </TabsTrigger>
                  <TabsTrigger value="day2" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    Day 2
                  </TabsTrigger>
                  <TabsTrigger value="day3" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                    Day 3
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline"
                onClick={handleRegeneratePlan}
                className="border-2 border-purple-300 hover:bg-purple-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Plan
              </Button>
            </div>

            {/* Meal Plans */}
            <div className="space-y-10">
              {/* Breakfast */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3>Breakfast Options</h3>
                    <p className="text-sm text-gray-600">Start your day right with healthy Indian breakfast</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {currentPlan.breakfast.map((meal, i) => (
                    <div key={i}>{renderMealCard(meal)}</div>
                  ))}
                </div>
              </div>

              {/* Lunch */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3>Lunch Options</h3>
                    <p className="text-sm text-gray-600">Nutritious midday meals to keep you energized</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {currentPlan.lunch.map((meal, i) => (
                    <div key={i}>{renderMealCard(meal)}</div>
                  ))}
                </div>
              </div>

              {/* Dinner */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <MoonIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3>Dinner Options</h3>
                    <p className="text-sm text-gray-600">Light and healthy dinners for better sleep</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {currentPlan.dinner.map((meal, i) => (
                    <div key={i}>{renderMealCard(meal)}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Nutrition Summary */}
            <Card className="p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 shadow-xl">
              <h4 className="mb-6 text-center">Daily Nutrition Guidelines</h4>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border-2 border-orange-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Calories</p>
                    <p>1,200-1,500</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border-2 border-blue-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Droplet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Protein</p>
                    <p>70-100g</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border-2 border-green-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fiber</p>
                    <p>25-35g</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border-2 border-purple-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p>130-180g</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="food-tracker">
            <FoodTracker />
          </TabsContent>
        </Tabs>
      </div>

      {/* Recipe Dialog */}
      <RecipeDialog 
        recipe={selectedRecipe}
        open={recipeDialogOpen}
        onOpenChange={setRecipeDialogOpen}
      />
    </div>
  );
}
