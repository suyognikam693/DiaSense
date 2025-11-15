import { useState } from 'react';
import { LoginPage } from './components/LoginPage.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { Toaster } from './components/ui/sonner.jsx';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateUserData = (healthData, riskScore) => {
    if (user) {
      setUser({
        ...user,
        healthData,
        riskScore
      });
    }
  };

  return (
    <>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onUpdateUserData={updateUserData}
          setUser={setUser}
        />
      )}
      <Toaster />
    </>
  );
}
