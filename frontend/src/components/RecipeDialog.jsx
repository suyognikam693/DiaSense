import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Flame, ExternalLink } from 'lucide-react';

export function RecipeDialog({ recipe, open, onOpenChange }) {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-orange-50">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {recipe.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={recipe.image} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {recipe.prepTime} min
              </Badge>
              <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                <Flame className="w-3 h-3 mr-1" />
                {recipe.calories} cal
              </Badge>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="text-center">
              <p className="text-2xl">⏱️</p>
              <p className="text-sm text-gray-600">Prep Time</p>
              <p>{recipe.prepTime} min</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">🍽️</p>
              <p className="text-sm text-gray-600">Servings</p>
              <p>{recipe.servings}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">🔥</p>
              <p className="text-sm text-gray-600">Calories</p>
              <p>{recipe.calories}</p>
            </div>
          </div>

          {/* Recipe Steps */}
          <div>
            <h4 className="mb-4 flex items-center gap-2">
              <span className="text-xl">📝</span>
              Recipe Steps
            </h4>
            <div className="space-y-3">
              {recipe.steps.map((step, index) => (
                <div 
                  key={index}
                  className="flex gap-4 p-4 rounded-xl bg-white border-2 border-purple-100 hover:border-purple-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
              <h4 className="mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Pro Tip
              </h4>
              <p className="text-gray-700">{recipe.tips}</p>
            </div>
          )}

          {/* YouTube Link */}
          {recipe.youtubeLink && (
            <Button 
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
              onClick={() => window.open(recipe.youtubeLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch Video Tutorial on YouTube
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
