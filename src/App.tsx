import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TwoFA from './components/TwoFA';
import Home from './components/Home';
import Pictures from './components/Pictures';
import Videos from './components/Videos';
import Wishlist from './components/Wishlist';
import { verifyAuthToken } from './lib/auth';

type AuthStep = 'login' | '2fa' | 'home' | 'pictures' | 'videos' | 'wishlist';

interface AuthState {
  step: AuthStep;
  nickname: string;
  dob: string;
}

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    step: 'login',
    nickname: '',
    dob: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const isValid = verifyAuthToken();
    if (isValid) {
      setAuth((prev) => ({ ...prev, step: 'home' }));
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (nickname: string, dob: string) => {
    setAuth({
      step: '2fa',
      nickname,
      dob,
    });
  };

  const handle2FASuccess = () => {
    setAuth((prev) => ({ ...prev, step: 'home' }));
  };

  const handleLogout = () => {
    setAuth({
      step: 'login',
      nickname: '',
      dob: '',
    });
  };

  const handleNavigate = (page: AuthStep) => {
    setAuth((prev) => ({ ...prev, step: page }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-700 text-lg font-semibold">Loading your special day...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {auth.step === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      {auth.step === '2fa' && (
        <TwoFA
          nickname={auth.nickname}
          dob={auth.dob}
          onVerificationSuccess={handle2FASuccess}
        />
      )}
      {auth.step === 'home' && (
        <Home 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {auth.step === 'pictures' && (
        <Pictures onLogoutClick={handleLogout} onNavigate={handleNavigate} />
      )}
      {auth.step === 'videos' && (
        <Videos onLogoutClick={handleLogout} onNavigate={handleNavigate} />
      )}
      {auth.step === 'wishlist' && (
        <Wishlist onLogoutClick={handleLogout} onNavigate={handleNavigate} />
      )}
    </>
  );
};

export default App;
