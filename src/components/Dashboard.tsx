import React from 'react';
import { getStoredCredentials, clearAuthToken } from '../lib/auth';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const credentials = getStoredCredentials();

  const handleLogout = () => {
    clearAuthToken();
    onLogout();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-12 -left-12 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-blob filter" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-white/15 rounded-full blur-3xl animate-blob filter" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob filter" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Dashboard Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 animate-slide-in animate-pulse-glow">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-float text-4xl">
              🎉
            </div>
            <h1 className="text-4xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome!
            </h1>
            <p className="text-gray-600 text-base">Successfully authenticated</p>
          </div>

          {/* Credentials Display */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 space-y-5 border border-gray-200">
            {/* Nickname */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Nickname
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent capitalize">
                {credentials?.nickname}
              </p>
            </div>

            {/* Date of Birth */}
            <div className="pt-4 border-t border-gray-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Date of Birth
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {credentials?.dob
                  ? new Date(credentials.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Security Message */}
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-8 animate-slide-in">
            <span className="text-lg">✓</span>
            <span className="font-medium">Credentials are encrypted and secure</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-purple-400/50 transition-all duration-300 hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
          >
            <span>Logout</span>
            <span className="text-lg">→</span>
          </button>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
            Your session is secure and encrypted
          </p>
        </div>
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 text-3xl md:text-4xl animate-float" style={{ animationDelay: '0s' }}>✨</div>
        <div className="absolute top-3/4 right-12 text-3xl md:text-4xl animate-float" style={{ animationDelay: '1s' }}>🔐</div>
        <div className="absolute bottom-1/4 left-1/2 text-3xl md:text-4xl animate-float" style={{ animationDelay: '2s' }}>⭐</div>
      </div>
    </div>
  );
};

export default Dashboard;
