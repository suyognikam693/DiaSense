import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Coffee, Sun, Moon, Apple, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FoodEntry {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  timestamp: Date;
}

export function FoodTracker() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: '',
    mealType: 'breakfast' as const,
    calories: ''
  });

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.calories) {
      toast.error('Please fill in all fields');
      return;
    }

    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: newEntry.name,
      mealType: newEntry.mealType,
      calories: parseInt(newEntry.calories),
      timestamp: new Date()
    };

    setEntries([entry, ...entries]);
    setNewEntry({ name: '', mealType: 'breakfast', calories: '' });
    setOpen(false);
    toast.success('Food entry added!');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.success('Entry removed');
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="w-4 h-4" />;
      case 'lunch': return <Sun className="w-4 h-4" />;
      case 'dinner': return <Moon className="w-4 h-4" />;
      case 'snack': return <Apple className="w-4 h-4" />;
      default: return <Apple className="w-4 h-4" />;
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'lunch': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'dinner': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'snack': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const todayEntries = entries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            Food Intake Tracker
          </h3>
          <p className="text-gray-600 text-sm mt-1">Log your daily meals and track calories</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Log Food
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-white to-purple-50/30">
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foodName">Food Name</Label>
                <Input
                  id="foodName"
                  placeholder="e.g., Masala Dosa, Paneer Tikka"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mealType">Meal Type</Label>
                <Select
                  value={newEntry.mealType}
                  onValueChange={(value) => setNewEntry({ ...newEntry, mealType: value as any })}
                >
                  <SelectTrigger id="mealType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 350"
                  value={newEntry.calories}
                  onChange={(e) => setNewEntry({ ...newEntry, calories: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleAddEntry}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Add Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Calories</p>
              <p className="text-2xl">{todayEntries.reduce((sum, e) => sum + e.calories, 0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meals Logged</p>
              <p className="text-2xl">{todayEntries.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 flex items-center justify-center text-white text-xl">
              🎯
            </div>
            <div>
              <p className="text-sm text-gray-600">Calorie Goal</p>
              <p className="text-2xl">1500</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Food Entries List */}
      <Card className="p-6">
        <h4 className="mb-4">Recent Entries</h4>
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500">No food entries yet</p>
            <p className="text-sm text-gray-400 mt-2">Start logging your meals to track your intake</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-purple-300 transition-colors bg-white"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge className={`${getMealColor(entry.mealType)} border-2`}>
                    {getMealIcon(entry.mealType)}
                    <span className="ml-1 capitalize">{entry.mealType}</span>
                  </Badge>
                  <div className="flex-1">
                    <p>{entry.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-2 border-purple-300">
                    {entry.calories} cal
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
