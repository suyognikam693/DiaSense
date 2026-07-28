import { RiskMeter } from './RiskMeter';
import { AdviceSection } from './AdviceSection';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Activity, Heart, TrendingDown, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage({ user }) {
  const navigate = useNavigate();
  const hasCompletedAssessment = user?.healthData && user?.riskScore !== undefined;

  // Reusable text gradient styles
  const purplePinkGradientText = {
    background: 'linear-gradient(to right, #9333ea, #db2777)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  };

  const blueCyanGradientText = {
    background: 'linear-gradient(to right, #2563eb, #0891b2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  };

  // Determine risk icon color
  let riskGradient = 'linear-gradient(135deg, #4ade80, #10b981)'; // Green
  if (user?.riskScore >= 75) riskGradient = 'linear-gradient(135deg, #ef4444, #ec4899)'; // Red
  else if (user?.riskScore >= 50) riskGradient = 'linear-gradient(135deg, #fb923c, #f87171)'; // Orange
  else if (user?.riskScore >= 25) riskGradient = 'linear-gradient(135deg, #facc15, #fb923c)'; // Yellow

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '40px 20px' }}>
      {hasCompletedAssessment ? (
        // DASHBOARD VIEW
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Welcome Section */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Your Health Dashboard</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', margin: 0 }}>
              Track your diabetes risk and get personalized recommendations
            </p>
          </div>

          {/* Stats Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Risk Score */}
            <Card style={{ padding: '24px', background: 'linear-gradient(135deg, #ffffff, #faf5ff)', border: '2px solid #f3e8ff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: riskGradient, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <Activity size={28} color="white" />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Risk Score</p>
                  <p style={{ fontSize: '2.25rem', fontWeight: '700', ...purplePinkGradientText }}>{user.riskScore}%</p>
                </div>
              </div>
            </Card>

            {/* BMI */}
            <Card style={{ padding: '24px', background: 'linear-gradient(135deg, #ffffff, #eff6ff)', border: '2px solid #dbeafe', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <Heart size={28} color="white" />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>BMI</p>
                  <p style={{ fontSize: '2.25rem', fontWeight: '700', ...blueCyanGradientText }}>
                    {(parseFloat(user.healthData.weight) / Math.pow(parseFloat(user.healthData.height) / 100, 2)).toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Fasting Glucose */}
            <Card style={{ padding: '24px', background: 'linear-gradient(135deg, #ffffff, #fdf2f8)', border: '2px solid #fce7f3', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #c084fc, #ec4899)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <TrendingDown size={28} color="white" />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Glucose (Fasting)</p>
                  <p style={{ fontSize: '2.25rem', fontWeight: '700', ...purplePinkGradientText }}>
                    {user.healthData.glucoseLevelBeforeFasting || 'N/A'} {user.healthData.glucoseLevelBeforeFasting && <span style={{ fontSize: '1rem', color: '#94a3b8' }}>mg/dL</span>}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Clinical Readings Report */}
          <Card style={{ padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.5rem', fontWeight: '700', ...blueCyanGradientText }}>
              📊 Clinical Readings Report
            </h3>
            
            {(() => {
              const bmi = parseFloat(user.healthData.bmi);
              const glucoseBefore = parseFloat(user.healthData.glucoseLevelBeforeFasting);
              const glucoseAfter = parseFloat(user.healthData.glucoseLevelAfterFasting);
              const systolicBP = user.healthData.highBP === '1';
              const cholesterol = user.healthData.highChol === '1';
              
              const innerCardStyle = { padding: '16px', border: '2px solid #e2e8f0', borderRadius: '12px' };
              const outOfRangeStyle = { fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' };
              const normalStyle = { fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' };

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  {/* BMI */}
                  <div style={innerCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ color: '#334155', fontWeight: '500' }}>Body Mass Index (BMI)</span>
                      {(bmi < 18.5 || bmi > 24.9) ? <span style={outOfRangeStyle}>Out of Range</span> : <span style={normalStyle}>Normal</span>}
                    </div>
                    <p style={{ fontSize: '1.5rem', margin: '0 0 4px 0', fontWeight: (bmi < 18.5 || bmi > 24.9) ? '700' : '400', color: '#0f172a' }}>
                      {bmi.toFixed(1)} kg/m²
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                      Normal Range: <span style={{ fontWeight: '600' }}>18.5 - 24.9 kg/m²</span>
                    </p>
                    {bmi < 18.5 && <p style={{ fontSize: '0.75rem', color: '#ea580c', margin: 0, fontWeight: '500' }}>Status: Underweight</p>}
                    {bmi >= 18.5 && bmi <= 24.9 && <p style={{ fontSize: '0.75rem', color: '#16a34a', margin: 0, fontWeight: '500' }}>Status: Normal</p>}
                    {bmi > 24.9 && bmi <= 29.9 && <p style={{ fontSize: '0.75rem', color: '#ca8a04', margin: 0, fontWeight: '500' }}>Status: Overweight</p>}
                    {bmi > 29.9 && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0, fontWeight: '500' }}>Status: Obese</p>}
                  </div>

                  {/* Fasting Glucose */}
                  {glucoseBefore && (
                    <div style={innerCardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ color: '#334155', fontWeight: '500' }}>Fasting Blood Glucose</span>
                        {(glucoseBefore < 70 || glucoseBefore > 100) ? <span style={outOfRangeStyle}>Out of Range</span> : <span style={normalStyle}>Normal</span>}
                      </div>
                      <p style={{ fontSize: '1.5rem', margin: '0 0 4px 0', fontWeight: (glucoseBefore < 70 || glucoseBefore > 100) ? '700' : '400', color: '#0f172a' }}>
                        {glucoseBefore} mg/dL
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                        Normal Range: <span style={{ fontWeight: '600' }}>70 - 100 mg/dL</span>
                      </p>
                      {glucoseBefore < 70 && <p style={{ fontSize: '0.75rem', color: '#ea580c', margin: 0, fontWeight: '500' }}>Status: Hypoglycemia (Low)</p>}
                      {glucoseBefore >= 70 && glucoseBefore <= 100 && <p style={{ fontSize: '0.75rem', color: '#16a34a', margin: 0, fontWeight: '500' }}>Status: Normal</p>}
                      {glucoseBefore > 100 && glucoseBefore <= 125 && <p style={{ fontSize: '0.75rem', color: '#ca8a04', margin: 0, fontWeight: '500' }}>Status: Prediabetes</p>}
                      {glucoseBefore > 125 && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0, fontWeight: '500' }}>Status: Diabetes Range</p>}
                    </div>
                  )}

                  {/* Postprandial Glucose */}
                  {glucoseAfter && (
                    <div style={innerCardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ color: '#334155', fontWeight: '500' }}>Postprandial Glucose</span>
                        {glucoseAfter > 140 ? <span style={outOfRangeStyle}>Out of Range</span> : <span style={normalStyle}>Normal</span>}
                      </div>
                      <p style={{ fontSize: '1.5rem', margin: '0 0 4px 0', fontWeight: glucoseAfter > 140 ? '700' : '400', color: '#0f172a' }}>
                        {glucoseAfter} mg/dL
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                        Normal Range: <span style={{ fontWeight: '600' }}>{'< 140 mg/dL'}</span>
                      </p>
                      {glucoseAfter <= 140 && <p style={{ fontSize: '0.75rem', color: '#16a34a', margin: 0, fontWeight: '500' }}>Status: Normal</p>}
                      {glucoseAfter > 140 && glucoseAfter <= 199 && <p style={{ fontSize: '0.75rem', color: '#ca8a04', margin: 0, fontWeight: '500' }}>Status: Prediabetes</p>}
                      {glucoseAfter >= 200 && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0, fontWeight: '500' }}>Status: Diabetes Range</p>}
                    </div>
                  )}

                  {/* Blood Pressure */}
                  <div style={innerCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ color: '#334155', fontWeight: '500' }}>Blood Pressure</span>
                      {systolicBP ? <span style={outOfRangeStyle}>High</span> : <span style={normalStyle}>Normal</span>}
                    </div>
                    <p style={{ fontSize: '1.5rem', margin: '0 0 4px 0', fontWeight: systolicBP ? '700' : '400', color: '#0f172a' }}>
                      {systolicBP ? 'Elevated' : 'Normal'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                      Normal Range: <span style={{ fontWeight: '600' }}>{'< 120/80 mmHg'}</span>
                    </p>
                    {systolicBP && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0, fontWeight: '500' }}>Status: Hypertension detected</p>}
                    {!systolicBP && <p style={{ fontSize: '0.75rem', color: '#16a34a', margin: 0, fontWeight: '500' }}>Status: Normal</p>}
                  </div>

                  {/* Cholesterol */}
                  <div style={innerCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ color: '#334155', fontWeight: '500' }}>Cholesterol Level</span>
                      {cholesterol ? <span style={outOfRangeStyle}>High</span> : <span style={normalStyle}>Normal</span>}
                    </div>
                    <p style={{ fontSize: '1.5rem', margin: '0 0 4px 0', fontWeight: cholesterol ? '700' : '400', color: '#0f172a' }}>
                      {cholesterol ? 'Elevated' : 'Normal'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 4px 0' }}>
                      Normal Range: <span style={{ fontWeight: '600' }}>{'< 200 mg/dL (Total)'}</span>
                    </p>
                    {cholesterol && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0, fontWeight: '500' }}>Status: High cholesterol detected</p>}
                    {!cholesterol && <p style={{ fontSize: '0.75rem', color: '#16a34a', margin: 0, fontWeight: '500' }}>Status: Normal</p>}
                  </div>
                </div>
              );
            })()}
          </Card>

          {/* Risk Assessment */}
          <Card style={{ padding: '32px', background: 'linear-gradient(135deg, #ffffff, #faf5ff)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '2px solid #f3e8ff', borderRadius: '16px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '1.5rem', fontWeight: '700', ...purplePinkGradientText }}>
              ✨ Your Diabetes Risk Assessment
            </h3>
            <RiskMeter riskScore={user.riskScore} />
          </Card>

          {/* Personalized Advice */}
          <AdviceSection riskScore={user.riskScore} userData={user.healthData} />

          {/* Quick Actions */}
          <Card style={{ padding: '32px', background: 'linear-gradient(135deg, #faf5ff, #fdf2f8, #fff7ed)', border: '2px solid #e9d5ff', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '0 0 24px 0' }}>Quick Actions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
                <Calendar size={18} />
                Schedule Check-up Reminder
              </Button>
              <Button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}>
                <Activity size={18} />
                View Progress History
              </Button>
            </div>
          </Card>

        </div>
      ) : (
        // WELCOME VIEW FOR USERS WITHOUT DATA
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          {/* Pill Badge */}
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#eff6ff', 
            color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '8px 20px', 
            borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '24px'
          }}>
            <Heart size={16} color="#ec4899" />
            YOUR HEALTH, OUR PRIORITY
          </div>
          
          <h2 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', lineHeight: '1.2' }}>
            Welcome to <span style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DiaSense</span>
          </h2>
          
          <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '650px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
            Start your health journey by completing a quick health assessment. 
            Get personalized insights about your diabetes risk and actionable recommendations.
          </p>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            <Card style={{ padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Activity size={28} color="#2563eb" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>Non-Clinical</h4>
              <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>No invasive tests required. Just your lifestyle data.</p>
            </Card>
            
            <Card style={{ padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#faf5ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Heart size={28} color="#9333ea" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>Personalized</h4>
              <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>Get advice tailored to your unique health profile.</p>
            </Card>
            
            <Card style={{ padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Activity size={28} color="#16a34a" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>Actionable</h4>
              <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>Receive clear steps to reduce your risk today.</p>
            </Card>
          </div>

          <Card style={{ 
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '60px 40px', 
            borderRadius: '24px', color: 'white', border: 'none', boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)'
          }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 16px 0' }}>Ready to get started?</h3>
            <p style={{ fontSize: '1.125rem', margin: '0 auto 32px auto', maxWidth: '600px', color: '#e0e7ff', lineHeight: '1.6' }}>
              Complete your health assessment in the Profile section to get your personalized risk score 
              and recommendations.
            </p>
            <Button 
              onClick={() => navigate('/profile')}
              style={{ 
                backgroundColor: '#ffffff', color: '#2563eb', padding: '16px 32px', 
                borderRadius: '999px', fontSize: '1.125rem', fontWeight: '700',
                border: 'none', cursor: 'pointer'
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