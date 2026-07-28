import { Progress } from './ui/progress';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export function RiskMeter({ riskScore }) {
  const getRiskLevel = (score) => {
    if (score < 25) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
    if (score < 50) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertCircle };
    if (score < 75) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertTriangle };
    return { level: 'Very High', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle };
  };

  const risk = getRiskLevel(riskScore);
  const Icon = risk.icon;

  const getProgressColor = (score) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Risk Score Display */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 ${risk.bgColor} ${risk.color} px-6 py-3 rounded-full mb-4`}>
          <Icon className="w-5 h-5" />
          <span>{risk.level} Risk</span>
        </div>
        <div className="mb-2">
          <span className="text-6xl">{riskScore}%</span>
        </div>
        <p className="text-gray-600">Diabetes Risk Score</p>
      </div>

      {/* Visual Meter */}
      <div className="space-y-3">
        <div className="relative">
          <Progress value={riskScore} className="h-8" />
          <div 
            className={`absolute top-0 left-0 h-8 rounded-full transition-all duration-1000 ${getProgressColor(riskScore)}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        
        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        
        {/* Risk Zones */}
        <div className="grid grid-cols-4 gap-2 text-xs text-center">
          <div className="space-y-1">
            <div className="bg-green-100 border-2 border-green-300 rounded p-2">
              <span className="text-green-700">Low</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded p-2">
              <span className="text-yellow-700">Moderate</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="bg-orange-100 border-2 border-orange-300 rounded p-2">
              <span className="text-orange-700">High</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="bg-red-100 border-2 border-red-300 rounded p-2">
              <span className="text-red-700">Very High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Interpretation */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-2">
        <h4>What does this mean?</h4>
        {riskScore < 25 && (
          <p className="text-gray-600">
            Your risk is low! You're doing great with your current lifestyle. Continue maintaining these healthy habits.
          </p>
        )}
        {riskScore >= 25 && riskScore < 50 && (
          <p className="text-gray-600">
            You have a moderate risk. Some lifestyle adjustments could help reduce your risk significantly.
          </p>
        )}
        {riskScore >= 50 && riskScore < 75 && (
          <p className="text-gray-600">
            Your risk is high. It's important to make lifestyle changes and consider consulting with a healthcare provider.
          </p>
        )}
        {riskScore >= 75 && (
          <p className="text-gray-600">
            Your risk is very high. We strongly recommend consulting with a healthcare provider soon and implementing the advice below.
          </p>
        )}
      </div>
    </div>
  );
}
