import { RiskMeter } from './RiskMeter';
import { AdviceSection } from './AdviceSection';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Activity, Heart, TrendingDown, Calendar } from 'lucide-react';

export function HomePage({ user }) {
  const hasCompletedAssessment = user.healthData && user.riskScore !== undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      {hasCompletedAssessment ? (
        // Dashboard view after assessment
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="mb-2">Your Health Dashboard</h2>
            <p className="text-gray-600">
              Track your diabetes risk and get personalized recommendations
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-white to-purple-50/30 border-2 border-purple-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  user.riskScore < 25 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  user.riskScore < 50 ? 'bg-gradient-to-br from-yellow-400 to-orange-400' :
                  user.riskScore < 75 ? 'bg-gradient-to-br from-orange-400 to-red-400' :
                  'bg-gradient-to-br from-red-500 to-pink-500'
                }`}>
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <p className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{user.riskScore}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-3xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {(parseFloat(user.healthData.weight) / Math.pow(parseFloat(user.healthData.height) / 100, 2)).toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-white to-pink-50/30 border-2 border-pink-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Glucose (Fasting)</p>
                  <p className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {user.healthData.glucoseLevelBeforeFasting || 'N/A'} {user.healthData.glucoseLevelBeforeFasting && <span className="text-sm">mg/dL</span>}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Clinical Readings Report */}
          <Card className="p-8 bg-white shadow-xl border-2 border-gray-100">
            <h3 className="text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📊 Clinical Readings Report</h3>
            <div className="space-y-4">
              {(() => {
                const bmi = parseFloat(user.healthData.bmi);
                const glucoseBefore = parseFloat(user.healthData.glucoseLevelBeforeFasting);
                const glucoseAfter = parseFloat(user.healthData.glucoseLevelAfterFasting);
                const systolicBP = user.healthData.highBP === '1';
                const cholesterol = user.healthData.highChol === '1';
                
                return (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* BMI */}
                    <div className="p-4 border-2 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-700">Body Mass Index (BMI)</span>
                        {(bmi < 18.5 || bmi > 24.9) && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Out of Range</span>
                        )}
                      </div>
                      <p className={`text-2xl ${(bmi < 18.5 || bmi > 24.9) ? 'font-bold' : ''}`}>
                        {bmi.toFixed(1)} kg/m²
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Normal Range: <span className="font-semibold">18.5 - 24.9 kg/m²</span>
                      </p>
                      {bmi < 18.5 && <p className="text-xs text-orange-600 mt-1">Status: Underweight</p>}
                      {bmi >= 18.5 && bmi <= 24.9 && <p className="text-xs text-green-600 mt-1">Status: Normal</p>}
                      {bmi > 24.9 && bmi <= 29.9 && <p className="text-xs text-yellow-600 mt-1">Status: Overweight</p>}
                      {bmi > 29.9 && <p className="text-xs text-red-600 mt-1">Status: Obese</p>}
                    </div>

                    {/* Fasting Glucose */}
                    {glucoseBefore && (
                      <div className="p-4 border-2 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-gray-700">Fasting Blood Glucose</span>
                          {(glucoseBefore < 70 || glucoseBefore > 100) && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Out of Range</span>
                          )}
                        </div>
                        <p className={`text-2xl ${(glucoseBefore < 70 || glucoseBefore > 100) ? 'font-bold' : ''}`}>
                          {glucoseBefore} mg/dL
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Normal Range: <span className="font-semibold">70 - 100 mg/dL</span>
                        </p>
                        {glucoseBefore < 70 && <p className="text-xs text-orange-600 mt-1">Status: Hypoglycemia (Low)</p>}
                        {glucoseBefore >= 70 && glucoseBefore <= 100 && <p className="text-xs text-green-600 mt-1">Status: Normal</p>}
                        {glucoseBefore > 100 && glucoseBefore <= 125 && <p className="text-xs text-yellow-600 mt-1">Status: Prediabetes</p>}
                        {glucoseBefore > 125 && <p className="text-xs text-red-600 mt-1">Status: Diabetes Range</p>}
                      </div>
                    )}

                    {/* Postprandial Glucose */}
                    {glucoseAfter && (
                      <div className="p-4 border-2 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-gray-700">Postprandial Blood Glucose</span>
                          {glucoseAfter > 140 && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Out of Range</span>
                          )}
                        </div>
                        <p className={`text-2xl ${glucoseAfter > 140 ? 'font-bold' : ''}`}>
                          {glucoseAfter} mg/dL
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Normal Range: <span className="font-semibold">{'< 140 mg/dL'}</span>
                        </p>
                        {glucoseAfter <= 140 && <p className="text-xs text-green-600 mt-1">Status: Normal</p>}
                        {glucoseAfter > 140 && glucoseAfter <= 199 && <p className="text-xs text-yellow-600 mt-1">Status: Prediabetes</p>}
                        {glucoseAfter >= 200 && <p className="text-xs text-red-600 mt-1">Status: Diabetes Range</p>}
                      </div>
                    )}

                    {/* Blood Pressure */}
                    <div className="p-4 border-2 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-700">Blood Pressure</span>
                        {systolicBP && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High</span>
                        )}
                      </div>
                      <p className={`text-2xl ${systolicBP ? 'font-bold' : ''}`}>
                        {systolicBP ? 'Elevated' : 'Normal'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Normal Range: <span className="font-semibold">{'< 120/80 mmHg'}</span>
                      </p>
                      {systolicBP && <p className="text-xs text-red-600 mt-1">Status: Hypertension detected</p>}
                      {!systolicBP && <p className="text-xs text-green-600 mt-1">Status: Normal</p>}
                    </div>

                    {/* Cholesterol */}
                    <div className="p-4 border-2 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-700">Cholesterol Level</span>
                        {cholesterol && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High</span>
                        )}
                      </div>
                      <p className={`text-2xl ${cholesterol ? 'font-bold' : ''}`}>
                        {cholesterol ? 'Elevated' : 'Normal'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Normal Range: <span className="font-semibold">{'< 200 mg/dL (Total)'}</span>
                      </p>
                      {cholesterol && <p className="text-xs text-red-600 mt-1">Status: High cholesterol detected</p>}
                      {!cholesterol && <p className="text-xs text-green-600 mt-1">Status: Normal</p>}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>

          {/* Risk Assessment */}
          <Card className="p-8 bg-gradient-to-br from-white to-purple-50/30 shadow-2xl border-2 border-purple-100">
            <h3 className="text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">✨ Your Diabetes Risk Assessment</h3>
            <RiskMeter riskScore={user.riskScore} />
          </Card>

          {/* Personalized Advice */}
          <AdviceSection riskScore={user.riskScore} userData={user.healthData} />

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200 shadow-xl">
            <h4 className="mb-4">Quick Actions</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Check-up Reminder
              </Button>
              <Button variant="outline" className="justify-start">
                <Activity className="w-4 h-4 mr-2" />
                View Progress History
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        // Initial welcome view
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Your Health, Our Priority</span>
          </div>
          
          <h2 className="mb-4">Welcome to DiaSense</h2>
          <p className="text-gray-600 text-lg">
            Start your health journey by completing a quick health assessment. 
            Get personalized insights about your diabetes risk and actionable recommendations.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="mb-2">Non-Clinical</h4>
              <p className="text-gray-600 text-sm">
                No invasive tests required. Just your lifestyle data.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="mb-2">Personalized</h4>
              <p className="text-gray-600 text-sm">
                Get advice tailored to your unique health profile.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="mb-2">Actionable</h4>
              <p className="text-gray-600 text-sm">
                Receive clear steps to reduce your risk today.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white mt-12">
            <h3 className="mb-4 text-white">Ready to get started?</h3>
            <p className="mb-6 text-blue-50">
              Complete your health assessment in the Profile section to get your personalized risk score 
              and recommendations.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => {
                // This would be handled by navigation context in real app
                const event = new CustomEvent('navigate-to-profile');
                window.dispatchEvent(event);
              }}
            >
              Go to Profile
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}