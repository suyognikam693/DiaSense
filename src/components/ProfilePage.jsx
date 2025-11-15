import { useState } from 'react';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User as UserIcon, Activity, Calendar, Upload, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ProfilePage({ user, onUpdateUserData, setUser, onNavigateToHome }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);

  const calculateRisk = (data) => {
    // Comprehensive risk calculation based on all parameters
    let risk = 0;
    
    // Diabetes status (most critical)
    if (data.diabetesStatus === '1') risk += 30;
    
    // Medical conditions
    if (data.highBP === '1') risk += 8;
    if (data.highChol === '1') risk += 8;
    if (data.stroke === '1') risk += 10;
    if (data.heartDiseaseOrAttack === '1') risk += 12;
    
    // BMI
    const bmi = parseFloat(data.bmi);
    if (bmi > 30) risk += 15;
    else if (bmi > 25) risk += 10;
    else if (bmi > 23) risk += 5;
    
    // Lifestyle factors
    if (data.smoker === '1') risk += 8;
    if (data.physicalActivity === '0') risk += 10;
    if (data.fruits === '0') risk += 3;
    if (data.veggies === '0') risk += 3;
    if (data.heavyAlcoholConsump === '1') risk += 6;
    
    // Sleep
    const sleepHours = parseFloat(data.sleepHours);
    if (sleepHours < 6 || sleepHours > 9) risk += 5;
    if (data.sleepQuality === 'poor') risk += 8;
    else if (data.sleepQuality === 'fair') risk += 4;
    
    // Diet
    if (data.sugarIntake === 'high') risk += 10;
    else if (data.sugarIntake === 'medium') risk += 5;
    
    // Exercise
    if (data.exerciseFrequency === 'never') risk += 10;
    else if (data.exerciseFrequency === 'rarely') risk += 6;
    
    // Glucose levels - check both before and after fasting
    const glucoseBefore = parseFloat(data.glucoseLevelBeforeFasting);
    const glucoseAfter = parseFloat(data.glucoseLevelAfterFasting);
    
    if (glucoseBefore) {
      if (glucoseBefore > 125) risk += 20;
      else if (glucoseBefore > 100) risk += 12;
      else if (glucoseBefore > 90) risk += 5;
    }
    
    if (glucoseAfter) {
      if (glucoseAfter > 200) risk += 20;
      else if (glucoseAfter > 140) risk += 12;
      else if (glucoseAfter > 120) risk += 5;
    }
    
    // Family history
    if (data.familyHistory === 'both') risk += 15;
    else if (data.familyHistory === 'one') risk += 10;
    
    // Symptoms (3 Ps)
    if (data.polyuria === 'severe') risk += 8;
    else if (data.polyuria === 'often') risk += 5;
    else if (data.polyuria === 'sometimes') risk += 2;
    
    if (data.polydipsia === 'severe') risk += 8;
    else if (data.polydipsia === 'often') risk += 5;
    else if (data.polydipsia === 'sometimes') risk += 2;
    
    if (data.polyphagia === 'severe') risk += 8;
    else if (data.polyphagia === 'often') risk += 5;
    else if (data.polyphagia === 'sometimes') risk += 2;
    
    // Health status
    const genHealth = parseInt(data.genHealth);
    if (genHealth >= 4) risk += 8;
    else if (genHealth === 3) risk += 4;
    
    const mentalHealth = parseInt(data.mentalHealth);
    if (mentalHealth > 20) risk += 5;
    else if (mentalHealth > 10) risk += 3;
    
    const physHealth = parseInt(data.physHealth);
    if (physHealth > 20) risk += 5;
    else if (physHealth > 10) risk += 3;
    
    // Health access
    if (data.healthcareCoverage === '0') risk += 3;
    if (data.noDocBcCost === '1') risk += 3;
    
    // Physical limitations
    if (data.diffWalk === '1') risk += 5;
    
    // Stress
    if (data.stressLevel === 'high') risk += 6;
    else if (data.stressLevel === 'medium') risk += 3;
    
    // Age factor
    const ageCategory = parseInt(data.ageCategory);
    if (ageCategory > 10) risk += 8;
    else if (ageCategory > 7) risk += 5;
    else if (ageCategory > 4) risk += 3;
    
    return Math.min(risk, 100);
  };

  const handleSubmitHealthData = (data) => {
    const calculatedRisk = calculateRisk(data);
    onUpdateUserData(data, calculatedRisk);
    toast.success('Health assessment completed!');
    
    // Navigate to home page after successful submission
    if (onNavigateToHome) {
      setTimeout(() => {
        onNavigateToHome();
      }, 500);
    }
  };

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: editedName,
      email: editedEmail
    });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleAvatarUpload = () => {
    // Mock avatar upload
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    setUser({
      ...user,
      profilePicture: newAvatar
    });
    toast.success('Profile picture updated!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mb-2">My Profile</h2>
          <p className="text-gray-600">
            Manage your account and health information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-purple-200">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarUpload}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload className="w-6 h-6 text-white" />
                </button>
              </div>
              {user.riskScore !== undefined && (
                <Badge className={`${
                  user.riskScore < 25 ? 'bg-green-100 text-green-700' :
                  user.riskScore < 50 ? 'bg-yellow-100 text-yellow-700' :
                  user.riskScore < 75 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                } hover:bg-current`}>
                  Risk: {user.riskScore}%
                </Badge>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-6">
              {!isEditingProfile ? (
                <>
                  <div>
                    <Label className="text-gray-500">Full Name</Label>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Member Since</Label>
                    <p className="text-lg">October 2025</p>
                  </div>
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedName(user.name);
                        setEditedEmail(user.email);
                        setIsEditingProfile(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs for Health Data */}
        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessment">
              <Activity className="w-4 h-4 mr-2" />
              Health Assessment
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="w-4 h-4 mr-2" />
              Assessment History
            </TabsTrigger>
          </TabsList>

          {/* Health Assessment Tab */}
          <TabsContent value="assessment" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="mb-2">
                  {user.healthData ? 'Update Your Health Assessment' : 'Complete Your Health Assessment'}
                </h3>
                <p className="text-gray-600">
                  {user.healthData 
                    ? 'Keep your health data up to date for accurate recommendations' 
                    : 'Fill out this form to get your personalized diabetes risk assessment'}
                </p>
              </div>
              
              <RiskAssessmentForm 
                onSubmit={handleSubmitHealthData}
                initialData={user.healthData}
              />
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="p-6">
              {user.healthData ? (
                <div className="space-y-6">
                  <h3>Previous Assessments</h3>
                  
                  {/* Current Assessment */}
                  <div className="border-l-4 border-blue-600 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p>Current Assessment</p>
                        <p className="text-sm text-gray-500">Completed recently</p>
                      </div>
                      <Badge className={`${
                        user.riskScore < 25 ? 'bg-green-100 text-green-700' :
                        user.riskScore < 50 ? 'bg-yellow-100 text-yellow-700' :
                        user.riskScore < 75 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      } hover:bg-current`}>
                        {user.riskScore}% Risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-gray-500">BMI</p>
                        <p>
                          {(parseFloat(user.healthData.weight) / Math.pow(parseFloat(user.healthData.height) / 100, 2)).toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fasting Glucose</p>
                        <p>{user.healthData.glucoseLevelBeforeFasting || 'N/A'} {user.healthData.glucoseLevelBeforeFasting && 'mg/dL'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Sleep</p>
                        <p>{user.healthData.sleepHours} hrs</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Exercise</p>
                        <p className="capitalize">{user.healthData.exerciseFrequency}</p>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for past assessments */}
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Complete regular assessments to track your progress over time
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="mb-2">No Assessment Yet</h4>
                  <p className="text-gray-600 mb-6">
                    Complete your first health assessment to start tracking your diabetes risk
                  </p>
                  <Button
                    onClick={() => {
                      const tabTrigger = document.querySelector('[value="assessment"]');
                      tabTrigger?.click();
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Start Assessment
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
