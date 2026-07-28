import { useState,useEffect } from 'react';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User as UserIcon, Activity, Calendar, Upload, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from "react-router-dom";


export function ProfilePage({ user, onUpdateUserData, setUser, onNavigateToHome }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const navigate = useNavigate();
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/assessment/${user.id}`);
        const assessments = await res.json();

        if (assessments.length > 0) {
          const a = assessments[0];

          setUser(prev => {
            if (prev.healthData) return prev;
            return {
            ...prev,
            riskScore: a.risk_score,
            healthData: {
              id: a.id,
              age: a.age,
              sex: a.sex,
              educationLevel: a.education_level,
              incomeLevel: a.income_level,
              weight: a.weight,
              height: a.height,
              cholCheck: a.chol_check,
              diabetesStatus: a.diabetes_status,
              highBP: a.high_bp ? "1" : "0",
              highChol: a.high_chol ? "1" : "0",
              stroke: a.stroke ? "1" : "0",
              heartDiseaseOrAttack: a.heart_disease ? "1" : "0",

              bmi: a.bmi,
              glucoseLevelBeforeFasting: a.glucose_before_fasting,
              glucoseLevelAfterFasting: a.glucose_after_fasting,

              smoker: a.smoker ? "1" : "0",
              physicalActivity: a.physical_activity ? "1" : "0",
              fruits: a.fruits ? "1" : "0",
              veggies: a.veggies ? "1" : "0",
              heavyAlcoholConsump: a.heavy_alcohol ? "1" : "0",

              sleepHours: a.sleep_hours,
              sleepQuality: a.sleep_quality,
              sugarIntake: a.sugar_intake,
              exerciseFrequency: a.exercise_frequency,

              polyuria: a.polyuria,
              polydipsia: a.polydipsia,
              polyphagia: a.polyphagia,

              genHealth: a.gen_health,
              mentalHealth: a.mental_health,
              physHealth: a.phys_health,

              stressLevel: a.stress_level,
              familyHistory: a.family_history,

              healthcareCoverage: a.healthcare_coverage ? "1" : "0",
              noDocBcCost: a.no_doc_bc_cost ? "1" : "0",
              diffWalk: a.diff_walk ? "1" : "0",

              ageCategory: a.age_category,
            },
          
          };
        });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (!user?.id) {
      return;
    }
    loadAssessment();
  }, [user?.id]);

  
  // New loading states for backend operations
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Note: For security, consider moving this risk calculation to your backend server.
  const calculateRisk = (data) => {
    let risk = 50;
    return Math.min(risk, 100);
  };

  const handleSubmitHealthData = async (data, predictionResult) => {
  const riskScore = predictionResult?.risk_score || 0;
  setIsSaving(true);

  try {
    const isUpdate = !!user.healthData?.id;

    const response = await fetch(
      isUpdate
        ? `http://localhost:5000/api/assessment/${user.healthData.id}`
        : "http://localhost:5000/api/assessment",
      {
        method: isUpdate ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        risk_score: riskScore, // or remove if your ML model returns it
        age: data.age,
        sex: data.sex,
        education_level: data.educationLevel,
        income_level: data.incomeLevel,
        weight: data.weight,
        height: data.height,
        chol_check: data.cholCheck === "1",
        diabetes_status: data.diabetesStatus,
        high_bp: data.highBP === "1",
        high_chol: data.highChol === "1",
        stroke: data.stroke === "1",
        heart_disease: data.heartDiseaseOrAttack === "1",

        bmi: data.bmi,
        glucose_before_fasting: data.glucoseLevelBeforeFasting,
        glucose_after_fasting: data.glucoseLevelAfterFasting,

        smoker: data.smoker === "1",
        physical_activity: data.physicalActivity === "1",
        fruits: data.fruits === "1",
        veggies: data.veggies === "1",
        heavy_alcohol: data.heavyAlcoholConsump === "1",

        sleep_hours: data.sleepHours,
        sleep_quality: data.sleepQuality,
        sugar_intake: data.sugarIntake,
        exercise_frequency: data.exerciseFrequency,

        polyuria: data.polyuria,
        polydipsia: data.polydipsia,
        polyphagia: data.polyphagia,

        gen_health: data.genHealth,
        mental_health: data.mentalHealth,
        phys_health: data.physHealth,

        stress_level: data.stressLevel,
        family_history: data.familyHistory,

        healthcare_coverage: data.healthcareCoverage === "1",
        no_doc_bc_cost: data.noDocBcCost === "1",
        diff_walk: data.diffWalk === "1",

        age_category: data.ageCategory,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save assessment");
    }

    const savedAssessment = await response.json();

    onUpdateUserData(data, savedAssessment.risk_score);

    toast.success("Health assessment saved successfully!");

    // Navigate to dashboard
    if (onNavigateToHome) {
      onNavigateToHome();
    }

  } catch (err) {
    console.error(err);
    toast.error("Could not save assessment.");
  } finally {
    setIsSaving(false);
  }
};

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // BACKEND INTEGRATION: Update user info in your API
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      // Update local state after successful DB save
      setUser({
        ...user,
        name: editedName,
        email: editedEmail
      });
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error('Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', user.id);

    try {
      // BACKEND INTEGRATION: Upload image to a storage bucket (S3, Cloudinary, etc.)
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const { avatarUrl } = await response.json();
      
      setUser({
        ...user,
        profilePicture: avatarUrl
      });
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Format the user's creation date from the DB dynamically
  const memberSinceDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'October 2025'; // Fallback if no date provided

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
              <div className="relative group cursor-pointer">
                <Avatar className="w-32 h-32 border-4 border-purple-200">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Changed to a label encapsulating a hidden file input for real image uploads */}
                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-white" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </label>
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
                    <p className="text-lg">{memberSinceDate}</p>
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
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isSaving}
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
                isSaving={isSaving} 
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