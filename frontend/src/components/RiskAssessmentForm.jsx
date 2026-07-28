import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Moon, Utensils, Activity, Droplet, Users, Brain, Scale, Ruler, AlertCircle, Heart, Stethoscope, Apple, Cigarette, DollarSign, GraduationCap, Loader2 } from 'lucide-react';

// Notice we are now accepting onSubmit and isSaving to match ProfilePage!
export function RiskAssessmentForm({ initialData, onSubmit, isSaving }) {
  const [formData, setFormData] = useState(initialData || {
    age: '', sex: '', ageCategory: '', educationLevel: '', incomeLevel: '',
    weight: '', height: '', bmi: '',
    highBP: '', highChol: '', cholCheck: '', stroke: '', heartDiseaseOrAttack: '', diffWalk: '',
    smoker: '', physicalActivity: '', fruits: '', veggies: '', heavyAlcoholConsump: '',
    sleepHours: '', sleepQuality: '', mealsPerDay: '', sugarIntake: '', exerciseFrequency: '',
    glucoseLevelBeforeFasting: '', glucoseLevelAfterFasting: '', familyHistory: '', stressLevel: '',
    polyuria: '', polydipsia: '', polyphagia: '',
    genHealth: '', mentalHealth: '', physHealth: '', healthcareCoverage: '', noDocBcCost: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!initialData) return;

    setFormData(prev => {
      // initialize only once
      if (prev.age || prev.sex || prev.weight) return prev;

      const sanitizedData = Object.fromEntries(
        Object.entries(initialData).map(([k, v]) => [
          k,
          v ?? ""
        ])
      );

      return sanitizedData;
    });
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'weight' || field === 'height') {
        const weight = parseFloat(field === 'weight' ? value : prev.weight);
        const height = parseFloat(field === 'height' ? value : prev.height);
        if (weight && height) {
          const bmi = weight / Math.pow(height / 100, 2);
          updated.bmi = bmi.toFixed(1);
        }
      }
      return updated;
    });
  };

  const isFormValid = () => {
    const requiredFields = Object.entries(formData).filter(([key]) => 
      key !== 'glucoseLevelBeforeFasting' && key !== 'glucoseLevelAfterFasting'
    );
    return requiredFields.every(([, value]) => value !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // 1. Get the prediction from your ML Model
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      setResult(data); // Show the beautiful score card UI at the bottom
      
      // 2. Pass the data back up to ProfilePage so it can save to the DB
      if (onSubmit) {
        onSubmit(formData,data);
      }
      
      // Removed the navigate('/') here so the user actually gets to 
      // see their results on this page before navigating away manually!
      
    } catch (err) {
      console.error("Prediction Error:", err);
      alert("Failed to get prediction from server.");
    } finally {
      setLoading(false);
    }
  };

  // Check if either the ML model is loading, or the DB is saving
  const isCurrentlyProcessing = loading || isSaving;

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-gradient-to-br from-white to-purple-50/30 shadow-xl border-2 border-purple-100/50">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Demographics */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Basic Demographics
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                  <SelectTrigger id="sex"><SelectValue placeholder="Select sex" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Female</SelectItem>
                    <SelectItem value="1">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input id="age" type="number" placeholder="e.g., 35" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} required min="1" max="120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageCategory">Age Category</Label>
                <Select value={formData.ageCategory} onValueChange={(value) => handleInputChange('ageCategory', value)}>
                  <SelectTrigger id="ageCategory"><SelectValue placeholder="Select age range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">18-24</SelectItem>
                    <SelectItem value="2">25-29</SelectItem>
                    <SelectItem value="3">30-34</SelectItem>
                    <SelectItem value="4">35-39</SelectItem>
                    <SelectItem value="5">40-44</SelectItem>
                    <SelectItem value="6">45-49</SelectItem>
                    <SelectItem value="7">50-54</SelectItem>
                    <SelectItem value="8">55-59</SelectItem>
                    <SelectItem value="9">60-64</SelectItem>
                    <SelectItem value="10">65-69</SelectItem>
                    <SelectItem value="11">70-74</SelectItem>
                    <SelectItem value="12">75-79</SelectItem>
                    <SelectItem value="13">80+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationLevel">
                  <GraduationCap className="w-4 h-4 inline mr-1" /> Education Level
                </Label>
                <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                  <SelectTrigger id="educationLevel"><SelectValue placeholder="Select education level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Never attended school</SelectItem>
                    <SelectItem value="2">Elementary</SelectItem>
                    <SelectItem value="3">Some high school</SelectItem>
                    <SelectItem value="4">High school graduate</SelectItem>
                    <SelectItem value="5">Some college/Technical school</SelectItem>
                    <SelectItem value="6">College graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incomeLevel">
                  <DollarSign className="w-4 h-4 inline mr-1" /> Income Level
                </Label>
                <Select value={formData.incomeLevel} onValueChange={(value) => handleInputChange('incomeLevel', value)}>
                  <SelectTrigger id="incomeLevel"><SelectValue placeholder="Select income range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Less than ₹10,000</SelectItem>
                    <SelectItem value="2">₹10,000 - ₹15,000</SelectItem>
                    <SelectItem value="3">₹15,000 - ₹20,000</SelectItem>
                    <SelectItem value="4">₹20,000 - ₹25,000</SelectItem>
                    <SelectItem value="5">₹25,000 - ₹35,000</SelectItem>
                    <SelectItem value="6">₹35,000 - ₹50,000</SelectItem>
                    <SelectItem value="7">₹50,000 - ₹75,000</SelectItem>
                    <SelectItem value="8">₹75,000 or more</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Physical Measurements
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="weight" type="number" placeholder="e.g., 70" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} className="pl-10" required min="20" max="300" step="0.1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="height" type="number" placeholder="e.g., 170" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} className="pl-10" required min="100" max="250" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bmi">BMI (Auto-calculated)</Label>
                <Input id="bmi" type="text" placeholder="Auto-calculated" value={formData.bmi} readOnly className="bg-gray-50" />
              </div>
            </div>
          </div>

          {/* Medical History & Conditions */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-red-600" />
              Medical History & Conditions
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="highBP">High Blood Pressure</Label>
                <Select value={formData.highBP} onValueChange={(value) => handleInputChange('highBP', value)}>
                  <SelectTrigger id="highBP"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="highChol">High Cholesterol</Label>
                <Select value={formData.highChol} onValueChange={(value) => handleInputChange('highChol', value)}>
                  <SelectTrigger id="highChol"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cholCheck">Cholesterol Check (Last 5 Years)</Label>
                <Select value={formData.cholCheck} onValueChange={(value) => handleInputChange('cholCheck', value)}>
                  <SelectTrigger id="cholCheck"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stroke">Ever Had a Stroke</Label>
                <Select value={formData.stroke} onValueChange={(value) => handleInputChange('stroke', value)}>
                  <SelectTrigger id="stroke"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartDiseaseOrAttack">Heart Disease or Heart Attack</Label>
                <Select value={formData.heartDiseaseOrAttack} onValueChange={(value) => handleInputChange('heartDiseaseOrAttack', value)}>
                  <SelectTrigger id="heartDiseaseOrAttack"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diffWalk">Difficulty Walking or Climbing Stairs</Label>
                <Select value={formData.diffWalk} onValueChange={(value) => handleInputChange('diffWalk', value)}>
                  <SelectTrigger id="diffWalk"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Lifestyle Factors
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="smoker"><Cigarette className="w-4 h-4 inline mr-1" /> Smoked 100+ Cigarettes in Lifetime</Label>
                <Select value={formData.smoker} onValueChange={(value) => handleInputChange('smoker', value)}>
                  <SelectTrigger id="smoker"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="physicalActivity">Physical Activity (Past 30 Days)</Label>
                <Select value={formData.physicalActivity} onValueChange={(value) => handleInputChange('physicalActivity', value)}>
                  <SelectTrigger id="physicalActivity"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fruits"><Apple className="w-4 h-4 inline mr-1" /> Consume Fruits 1+ Times Per Day</Label>
                <Select value={formData.fruits} onValueChange={(value) => handleInputChange('fruits', value)}>
                  <SelectTrigger id="fruits"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="veggies">Consume Vegetables 1+ Times Per Day</Label>
                <Select value={formData.veggies} onValueChange={(value) => handleInputChange('veggies', value)}>
                  <SelectTrigger id="veggies"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heavyAlcoholConsump">Heavy Alcohol Consumption</Label>
                <p className="text-xs text-gray-500">Men ≥14 drinks/week, Women ≥7 drinks/week</p>
                <Select value={formData.heavyAlcoholConsump} onValueChange={(value) => handleInputChange('heavyAlcoholConsump', value)}>
                  <SelectTrigger id="heavyAlcoholConsump"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sleep Patterns */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-600" />
              Sleep Patterns
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Average Sleep (hours/night)</Label>
                <Input id="sleepHours" type="number" placeholder="e.g., 7" value={formData.sleepHours} onChange={(e) => handleInputChange('sleepHours', e.target.value)} required min="0" max="24" step="0.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleepQuality">Sleep Quality</Label>
                <Select value={formData.sleepQuality} onValueChange={(value) => handleInputChange('sleepQuality', value)}>
                  <SelectTrigger id="sleepQuality"><SelectValue placeholder="Select quality" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Eating Patterns */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              Eating Patterns
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                <Input id="mealsPerDay" type="number" placeholder="e.g., 3" value={formData.mealsPerDay} onChange={(e) => handleInputChange('mealsPerDay', e.target.value)} required min="1" max="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugarIntake">Sugar Intake Level</Label>
                <Select value={formData.sugarIntake} onValueChange={(value) => handleInputChange('sugarIntake', value)}>
                  <SelectTrigger id="sugarIntake"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Rarely consume sugar)</SelectItem>
                    <SelectItem value="medium">Medium (Moderate consumption)</SelectItem>
                    <SelectItem value="high">High (Frequent consumption)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                <Select value={formData.exerciseFrequency} onValueChange={(value) => handleInputChange('exerciseFrequency', value)}>
                  <SelectTrigger id="exerciseFrequency"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="regular">3-5 times/week</SelectItem>
                    <SelectItem value="sometimes">1-2 times/week</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="glucoseLevelBeforeFasting">Fasting Glucose Level (mg/dL) <span className="text-gray-400">(Optional)</span></Label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="glucoseLevelBeforeFasting" type="number" placeholder="e.g., 95" value={formData.glucoseLevelBeforeFasting} onChange={(e) => handleInputChange('glucoseLevelBeforeFasting', e.target.value)} className="pl-10" min="50" max="300" />
                </div>
                <p className="text-xs text-gray-500">Normal: 70-100 mg/dL</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="glucoseLevelAfterFasting">Postprandial Glucose Level (mg/dL) <span className="text-gray-400">(Optional)</span></Label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="glucoseLevelAfterFasting" type="number" placeholder="e.g., 120" value={formData.glucoseLevelAfterFasting} onChange={(e) => handleInputChange('glucoseLevelAfterFasting', e.target.value)} className="pl-10" min="50" max="300" />
                </div>
                <p className="text-xs text-gray-500">Normal: = 140 mg/dL</p>
              </div>
            </div>
          </div>

          {/* Diabetes Symptoms (3 Ps) */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Diabetes Symptoms
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="polyuria">Polyuria (Excessive Urination)</Label>
                <Select value={formData.polyuria} onValueChange={(value) => handleInputChange('polyuria', value)}>
                  <SelectTrigger id="polyuria"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No, normal urination</SelectItem>
                    <SelectItem value="sometimes">Sometimes (occasional)</SelectItem>
                    <SelectItem value="often">Often (frequent)</SelectItem>
                    <SelectItem value="severe">Severe (very frequent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="polydipsia">Polydipsia (Excessive Thirst)</Label>
                <Select value={formData.polydipsia} onValueChange={(value) => handleInputChange('polydipsia', value)}>
                  <SelectTrigger id="polydipsia"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No, normal thirst</SelectItem>
                    <SelectItem value="sometimes">Sometimes (occasional)</SelectItem>
                    <SelectItem value="often">Often (constant thirst)</SelectItem>
                    <SelectItem value="severe">Severe (unquenchable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="polyphagia">Polyphagia (Excessive Hunger)</Label>
                <Select value={formData.polyphagia} onValueChange={(value) => handleInputChange('polyphagia', value)}>
                  <SelectTrigger id="polyphagia"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No, normal appetite</SelectItem>
                    <SelectItem value="sometimes">Sometimes (occasional)</SelectItem>
                    <SelectItem value="often">Often (constant hunger)</SelectItem>
                    <SelectItem value="severe">Severe (insatiable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Family History & Stress */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-600" />
              Family History & Mental Health
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="familyHistory">Family History of Diabetes</Label>
                <Select value={formData.familyHistory} onValueChange={(value) => handleInputChange('familyHistory', value)}>
                  <SelectTrigger id="familyHistory"><SelectValue placeholder="Select history" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No family history</SelectItem>
                    <SelectItem value="one">One parent/sibling</SelectItem>
                    <SelectItem value="both">Both parents/multiple relatives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stressLevel">Daily Stress Level</Label>
                <Select value={formData.stressLevel} onValueChange={(value) => handleInputChange('stressLevel', value)}>
                  <SelectTrigger id="stressLevel"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Health Status & Access */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              Health Status & Access
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="genHealth">General Health (1 = Excellent, 5 = Poor)</Label>
                <Select value={formData.genHealth} onValueChange={(value) => handleInputChange('genHealth', value)}>
                  <SelectTrigger id="genHealth"><SelectValue placeholder="Rate your health" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Excellent</SelectItem>
                    <SelectItem value="2">2 - Very Good</SelectItem>
                    <SelectItem value="3">3 - Good</SelectItem>
                    <SelectItem value="4">4 - Fair</SelectItem>
                    <SelectItem value="5">5 - Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentalHealth">Days of Poor Mental Health (Last 30 Days)</Label>
                <Input id="mentalHealth" type="number" placeholder="0-30 days" value={formData.mentalHealth} onChange={(e) => handleInputChange('mentalHealth', e.target.value)} required min="0" max="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="physHealth">Days of Physical Illness/Injury (Last 30 Days)</Label>
                <Input id="physHealth" type="number" placeholder="0-30 days" value={formData.physHealth} onChange={(e) => handleInputChange('physHealth', e.target.value)} required min="0" max="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthcareCoverage">Have Healthcare Coverage</Label>
                <Select value={formData.healthcareCoverage} onValueChange={(value) => handleInputChange('healthcareCoverage', value)}>
                  <SelectTrigger id="healthcareCoverage"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noDocBcCost">Could Not Visit Doctor Due to Cost (Past 12 Months)</Label>
                <Select value={formData.noDocBcCost} onValueChange={(value) => handleInputChange('noDocBcCost', value)}>
                  <SelectTrigger id="noDocBcCost"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!isFormValid() || isCurrentlyProcessing}
              size="lg"
            >
              {isCurrentlyProcessing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin inline" /> Processing Data...</>
              ) : "✨ Calculate My Risk Score"}
            </Button>
            {!isFormValid() && (
              <p className="text-sm text-gray-500 text-center mt-2">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </form>
      </Card>

      {/* RESULTS SECTION */}
      {result && (
        <Card className="p-8 bg-white shadow-xl border-2 border-green-100/50 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Diabetes Risk Score</h2>
            <div className="mt-4 flex items-center justify-center gap-4">
              <span className={`text-5xl font-black ${
                result.risk_score > 70 ? 'text-red-500' : 
                result.risk_score > 40 ? 'text-orange-500' : 'text-green-500'
              }`}>
                {result.risk_score}%
              </span>
              <span className="text-xl px-4 py-2 bg-gray-100 rounded-full font-semibold text-gray-600">
                {result.risk_category}
              </span>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Brain className="w-6 h-6 text-purple-600" />
              Why this prediction? (Top Factors)
            </h3>
            <div className="space-y-4">
              {result.top_factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{factor.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${factor.impact === 'Increases Risk' ? 'text-red-500' : 'text-green-500'}`}>
                      {factor.impact === 'Increases Risk' ? '↑' : '↓'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Impact Score: {factor.magnitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}