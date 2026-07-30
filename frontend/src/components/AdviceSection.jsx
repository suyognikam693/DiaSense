import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Moon, Utensils, Activity, Heart, Apple, Clock, CheckCircle, Youtube, Salad, Stethoscope, DollarSign, Brain, Cigarette } from 'lucide-react';
import { buildRiskRecommendations } from './riskInsights';

const ICONS = {
  Heart,
  Activity,
  Apple,
  Stethoscope,
  DollarSign,
  Brain,
  Cigarette,
  Salad,
  Moon,
  Utensils,
  Clock,
};

export function AdviceSection({ riskScore, userData, riskFactors = [] }) {
  const advice = riskFactors?.length > 0 ? buildRiskRecommendations(riskFactors) : [];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Medium Priority</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Low Priority</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2">Personalized Recommendations</h3>
        <p className="text-gray-600">
          Follow these evidence-based strategies to reduce your diabetes risk
        </p>
      </div>

      {advice.length > 0 ? (
        <div className="grid gap-6">
        {advice.map((item, index) => {
          const Icon = ICONS[item.iconKey] || Heart;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  item.priority === 'high' ? 'bg-red-100' : 
                  item.priority === 'medium' ? 'bg-yellow-100' : 
                  'bg-blue-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    item.priority === 'high' ? 'text-red-600' : 
                    item.priority === 'medium' ? 'text-yellow-600' : 
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h4>{item.title}</h4>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100"
                    onClick={() => window.open(item.youtubeUrl, '_blank')}
                  >
                    <Youtube className="w-4 h-4 mr-2 text-red-600" />
                    <span>Watch Tutorial Videos</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        </div>
      ) : (
        <Card className="p-6 border-dashed">
          <div className="text-center text-gray-600 space-y-2">
            <h4 className="font-semibold text-gray-800">No modifiable risk factors to prioritize right now</h4>
            <p>
              Your current profile does not surface actionable risk-increasing factors yet. Keep following your routine screening and healthy habits.
            </p>
          </div>
        </Card>
      )}

      {/* Additional Resources */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex gap-3">
          <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h4>Next Steps</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Schedule a check-up with your healthcare provider to discuss these results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Start implementing one recommendation at a time for sustainable change</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Retake this assessment every 3-6 months to track your progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Consider working with a registered dietitian or certified diabetes educator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>If you're experiencing high stress, consult a mental health professional</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
