import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Moon, Utensils, Activity, Heart, Apple, Clock, CheckCircle, Youtube, Salad } from 'lucide-react';

export function AdviceSection({ riskScore, userData }) {
  if (!userData) return null;

  const generateAdvice = () => {
    const advice = [];

    // DASH Diet recommendation (important for diabetes prevention)
    advice.push({
      icon: Salad,
      title: 'Follow the DASH Diet',
      description: 'The DASH (Dietary Approaches to Stop Hypertension) diet is highly recommended for diabetes prevention. It emphasizes fruits, vegetables, whole grains, lean proteins, and low-fat dairy while limiting sodium, saturated fats, and added sugars. This eating pattern helps control blood pressure, manage weight, and improve insulin sensitivity.',
      priority: 'high',
      youtubeUrl: 'https://www.youtube.com/results?search_query=DASH+diet+for+diabetes+prevention+Indian+style'
    });

    // High cholesterol - personalized advice
    if (userData.highChol === '1') {
      advice.push({
        icon: Heart,
        title: 'Reduce Oil and Fat Intake',
        description: 'Your cholesterol levels are elevated. Cut down on cooking oils, switch to healthier options like olive oil or mustard oil in moderation. Avoid deep-fried foods, ghee, butter, and full-fat dairy. Include omega-3 rich foods like walnuts, flaxseeds, and fish. Steam, grill, or bake your food instead of frying.',
        priority: 'high',
        youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+lower+cholesterol+naturally+Indian+diet'
      });
    }

    // High BP - personalized advice
    if (userData.highBP === '1') {
      advice.push({
        icon: Heart,
        title: 'Reduce Salt Intake',
        description: 'Your blood pressure is high. Limit salt to less than 5g per day (about 1 teaspoon). Avoid packaged foods, pickles, papad, and processed snacks that are high in sodium. Use herbs and spices like coriander, cumin, turmeric, and lemon for flavoring instead of salt. Check labels for hidden sodium content.',
        priority: 'high',
        youtubeUrl: 'https://www.youtube.com/results?search_query=low+sodium+Indian+recipes+for+high+blood+pressure'
      });
    }

    // Mental stress - personalized advice
    const mentalHealth = parseInt(userData.mentalHealth);
    if (userData.stressLevel === 'high' || mentalHealth > 15) {
      advice.push({
        icon: Heart,
        title: 'Manage Mental Stress',
        description: 'High stress levels can elevate blood sugar. Practice daily meditation, yoga, or deep breathing exercises for 15-20 minutes. Consider eating dark chocolate (70%+ cocoa) in moderation - it contains compounds that may reduce stress hormones and improve mood. Stay connected with loved ones and engage in hobbies you enjoy.',
        priority: 'high',
        youtubeUrl: 'https://www.youtube.com/results?search_query=stress+management+techniques+meditation+yoga'
      });
    }

    // Sleep advice
    const sleepHours = parseFloat(userData.sleepHours);
    if (sleepHours < 7 || sleepHours > 9 || userData.sleepQuality === 'poor' || userData.sleepQuality === 'fair') {
      advice.push({
        icon: Moon,
        title: 'Improve Sleep Quality',
        description: `Aim for 7-9 hours of quality sleep per night. ${sleepHours < 7 ? 'You\'re currently getting less sleep than recommended.' : sleepHours > 9 ? 'Too much sleep can also be problematic.' : 'Focus on improving sleep quality.'} Establish a regular bedtime routine, avoid screens before bed, and keep your bedroom cool and dark.`,
        priority: 'high',
        youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+improve+sleep+quality+at+home'
      });
    }

    // Sugar intake
    if (userData.sugarIntake === 'high' || userData.sugarIntake === 'medium') {
      advice.push({
        icon: Apple,
        title: 'Reduce Sugar Intake',
        description: `${userData.sugarIntake === 'high' ? 'Your high sugar consumption is a major risk factor.' : 'Moderate your sugar intake further.'} Replace sugary drinks with water, choose whole fruits over juice, and read nutrition labels carefully. Aim to keep added sugars under 25g per day. Avoid sweets, sodas, and packaged fruit juices.`,
        priority: userData.sugarIntake === 'high' ? 'high' : 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+reduce+sugar+intake+naturally'
      });
    }

    // Exercise
    if (userData.exerciseFrequency === 'never' || userData.exerciseFrequency === 'rarely' || userData.exerciseFrequency === 'sometimes') {
      advice.push({
        icon: Activity,
        title: 'Increase Physical Activity',
        description: `${userData.exerciseFrequency === 'never' ? 'Start with just 10-15 minutes of walking daily.' : 'Aim for at least 150 minutes of moderate activity per week.'} Regular exercise improves insulin sensitivity and helps maintain healthy blood sugar levels. Find activities you enjoy to make it sustainable.`,
        priority: userData.exerciseFrequency === 'never' ? 'high' : 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=exercise+for+diabetes+prevention+at+home'
      });
    }

    // Glucose levels
    const glucoseBefore = parseFloat(userData.glucoseLevelBeforeFasting);
    const glucoseAfter = parseFloat(userData.glucoseLevelAfterFasting);
    
    if (glucoseBefore > 100 || glucoseAfter > 140) {
      const maxGlucose = Math.max(glucoseBefore || 0, glucoseAfter || 0);
      advice.push({
        icon: Heart,
        title: 'Monitor Blood Glucose',
        description: `Your glucose level${glucoseBefore > 100 && glucoseAfter > 140 ? 's are' : ' is'} elevated. ${maxGlucose > 125 || glucoseAfter > 200 ? 'This is in the diabetic range.' : 'This is in the prediabetes range.'} Consult with a healthcare provider for proper testing and monitoring. Regular check-ups are crucial. Focus on a low glycemic index diet.`,
        priority: 'high',
        youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+monitor+blood+sugar+levels+at+home'
      });
    }

    // Weight management
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height) / 100;
    const bmi = weight / (height * height);
    if (bmi > 25) {
      advice.push({
        icon: Activity,
        title: 'Weight Management',
        description: `Your BMI is ${bmi.toFixed(1)}, which is ${bmi > 30 ? 'in the obese range' : 'overweight'}. Even a 5-10% reduction in body weight can significantly lower diabetes risk. Combine healthy eating with regular physical activity for sustainable weight loss. Focus on portion control and eating mindfully.`,
        priority: bmi > 30 ? 'high' : 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=healthy+weight+loss+tips+at+home'
      });
    }

    // Meal timing
    const mealsPerDay = parseInt(userData.mealsPerDay);
    if (mealsPerDay > 4 || mealsPerDay < 3) {
      advice.push({
        icon: Clock,
        title: 'Optimize Meal Timing',
        description: `${mealsPerDay > 4 ? 'Frequent eating may lead to constant insulin release.' : 'Too few meals can cause blood sugar spikes.'} Aim for 3 balanced meals with 1-2 small snacks if needed. Consider eating your last meal at least 2-3 hours before bed. Practice intermittent fasting if recommended by your doctor.`,
        priority: 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=best+meal+timing+for+diabetes+prevention'
      });
    }

    // General healthy eating
    advice.push({
      icon: Utensils,
      title: 'Follow a Balanced Diet',
      description: 'Focus on whole grains like brown rice, oats, and millets. Include plenty of vegetables, lean proteins (dal, legumes, chicken, fish), and healthy fats (nuts, seeds). Limit processed foods, refined carbohydrates like maida and white rice, and saturated fats. Eat colorful vegetables and stay hydrated.',
      priority: 'medium',
      youtubeUrl: 'https://www.youtube.com/results?search_query=indian+balanced+diet+for+diabetes+prevention'
    });

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return advice.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const advice = generateAdvice();

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

      <div className="grid gap-6">
        {advice.map((item, index) => {
          const Icon = item.icon;
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
