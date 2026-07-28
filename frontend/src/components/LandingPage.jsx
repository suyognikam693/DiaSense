import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Activity, Heart, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* --- HEADER --- */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '20px 5%', 
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #2563eb, #9333ea)', 
            padding: '10px', 
            borderRadius: '12px',
            display: 'flex'
          }}>
            <Activity color="white" size={20} />
          </div>
          {/* Added DiaSense Heading */}
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            margin: 0,
            background: 'linear-gradient(to right, #1d4ed8, #7e22ce)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            DiaSense
          </h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/login')}
          style={{ fontSize: '1rem', fontWeight: '500', cursor: 'pointer' }}
        >
          Log In
        </Button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        
        {/* Pill Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          backgroundColor: '#eff6ff', 
          color: '#1d4ed8', 
          border: '1px solid #bfdbfe', 
          padding: '8px 20px', 
          borderRadius: '999px', 
          fontSize: '0.875rem', 
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          <Heart size={16} color="#ec4899" />
          YOUR HEALTH, OUR PRIORITY
        </div>
        
        {/* Hero Headline */}
        <h2 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', lineHeight: '1.2' }}>
          Take Control of Your <br />
          <span style={{ 
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Health Journey
          </span>
        </h2>
        
        <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '650px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
          Start by completing a quick, non-invasive health assessment. 
          Get personalized insights about your diabetes risk and actionable recommendations today.
        </p>

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginBottom: '80px' 
        }}>
          {/* Card 1 */}
          <Card style={{ padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Activity size={28} color="#2563eb" />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>Non-Clinical</h4>
            <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>
              No invasive tests required. Just input your daily lifestyle data.
            </p>
          </Card>
          
          {/* Card 2 */}
          <Card style={{ padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#faf5ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Heart size={28} color="#9333ea" />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>Personalized</h4>
            <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>
              Get tailored advice and routines based on your unique health profile.
            </p>
          </Card>
          
          {/* Card 3 */}
          <Card style={{ padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Activity size={28} color="#16a34a" />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px', color: '#0f172a' }}>Actionable</h4>
            <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>
              Receive clear, easy-to-follow steps to reduce your risk today.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card style={{ 
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
          padding: '60px 40px', 
          borderRadius: '24px', 
          color: 'white',
          border: 'none',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)'
        }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 16px 0' }}>Ready to get started?</h3>
          <p style={{ fontSize: '1.125rem', margin: '0 auto 32px auto', maxWidth: '600px', color: '#e0e7ff', lineHeight: '1.6' }}>
            Join DiaSense today to get your personalized risk score 
            and take the first step towards a healthier you.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#2563eb', 
              padding: '16px 32px', 
              borderRadius: '999px', 
              fontSize: '1.125rem', 
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Get Started Now <ArrowRight size={20} />
          </Button>
        </Card>
        
      </main>
    </div>
  );
}