import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { validateCredentials, formatDateToString } from '../lib/auth';

interface LoginProps {
  onLoginSuccess: (nickname: string, dob: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(300); // 5 minutes for testing
  const [countdownActive, setCountdownActive] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if countdown is still active
    if (countdownActive && countdownSeconds > 0) {
      setError('⏰ Wait for the countdown to finish! Your gift is on the way! 🎁');
      setIsShaking(true);
      return;
    }

    setError('');
    setLoading(true);

    if (!nickname.trim()) {
      setError('Please enter your nickname 💕');
      setIsShaking(true);
      setLoading(false);
      return;
    }

    if (!selectedDate) {
      setError('Please select your date of birth 🎂');
      setIsShaking(true);
      setLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const dobString = formatDateToString(selectedDate);
    const isValid = validateCredentials(nickname, dobString);

    if (isValid) {
      onLoginSuccess(nickname, dobString);
    } else {
      setError('Hmm... that doesn\'t match our special day. Try again? ✨');
      setIsShaking(true);
      setSelectedDate(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  // Countdown timer effect
  useEffect(() => {
    if (!countdownActive || countdownSeconds <= 0) {
      if (countdownSeconds <= 0) {
        setCountdownActive(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          setCountdownActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownActive, countdownSeconds]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 font-sans">
      {/* Animated floating hearts background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300/40 animate-float-heart select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 8 + 6}s`,
            }}
          >
            ♡
          </div>
        ))}
      </div>

      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl animate-blob-slow animation-delay-4000"></div>
        
        {/* Twinkling stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Login Card */}
      <div className={`relative z-10 w-full max-w-md mx-auto px-4 ${isShaking ? 'animate-shake' : ''}`}>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/40 animate-slide-up">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 rounded-t-3xl animate-gradient-shift"></div>

          {/* Decorative corner hearts */}
          <div className="absolute -top-3 -left-3 text-3xl text-pink-400/70 animate-float">🌸</div>
          <div className="absolute -top-3 -right-3 text-3xl text-pink-400/70 animate-float animation-delay-1000">🌸</div>

          {/* Header */}
          <div className="text-center mb-8">
            {/* Animated Birthday Cake / Gift */}
            <div className="relative w-24 h-24 mx-auto mb-5">
              <div className="absolute inset-0 animate-bounce-slow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                  <span className="text-5xl">🎂</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-sparkle">✨</div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent mb-2 animate-gradient-x">
              Happy Birthday!
            </h1>
            <p className="text-rose-400 text-sm md:text-base font-medium mt-1">
              A special surprise awaits you ✨
            </p>
          </div>

          {/* Countdown Timer */}
          {countdownActive && countdownSeconds > 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 border-2 border-pink-300 shadow-lg animate-pulse">
              <div className="text-center">
                <p className="text-sm md:text-base font-semibold text-rose-600 mb-3">⏰ Your Gift is On The Way! ⏰</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:{String(countdownSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-rose-500 mt-3 font-medium">⏳ Wait for the magic moment... 🎁</p>
              </div>
            </div>
          )}

          {/* Countdown Complete Message */}
          {!countdownActive && countdownSeconds === 0 && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 border-2 border-green-400 shadow-lg animate-bounce-slow">
              <div className="text-center">
                <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🎉 It's Time! The Gift is Ready! 🎉</p>
                <p className="text-sm text-green-600 mt-2">✨ Open your surprise now! ✨</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Nickname Input */}
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>💝</span> Your Sweet Nickname
              </label>
              <div className="relative group">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname..."
                  className="w-full px-5 py-3.5 pr-12 border-2 border-pink-200 rounded-2xl text-sm transition-all duration-300 bg-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white focus:shadow-lg focus:shadow-pink-200/50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={loading || (countdownActive && countdownSeconds > 0)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none transition-transform group-focus-within:scale-110">💕</span>
              </div>
            </div>

              {/* Date of Birth Input - Hidden but required for verification */}
              <div className="space-y-2">
                <label htmlFor="dob" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>🎀</span> Our Special Date
                </label>
                <div className="relative group">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="MMMM dd, yyyy"
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="w-full px-5 py-3.5 pr-12 border-2 border-pink-200 rounded-2xl text-sm transition-all duration-300 bg-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white focus:shadow-lg focus:shadow-pink-200/50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    disabled={loading || (countdownActive && countdownSeconds > 0)}
                    placeholderText="🌸 When were you born? 🌸"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none transition-transform group-focus-within:scale-110">🎈</span>
                </div>
              </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-rose-50 border-l-4 border-rose-400 text-rose-700 rounded-xl text-sm animate-slide-in shadow-sm">
                <span className="text-lg">💔</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-pink-400/40 hover:scale-105 active:scale-98 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 group"
              disabled={loading || (countdownActive && countdownSeconds > 0)}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Checking your birthday...</span>
                </>
              ) : countdownActive && countdownSeconds > 0 ? (
                <>
                  <span className="text-lg">⏳</span>
                  <span>Wait for the countdown...</span>
                </>
              ) : (
                <>
                  <span>Open Your Surprise 🎁</span>
                  <span className="text-lg transition-transform group-hover:translate-x-1 group-hover:scale-110">🎀</span>
                </>
              )}
            </button>
          </form>

          {/* Decorative footer */}
          <div className="text-center mt-6 text-xs text-pink-300">
            <span>✨ Made with lots of love ✨</span>
          </div>
        </div>
      </div>

      {/* Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-5 text-3xl animate-float-slow opacity-70">🎀</div>
        <div className="absolute bottom-32 right-5 text-3xl animate-float-slow animation-delay-1500 opacity-70">🎈</div>
        <div className="absolute top-1/3 right-10 text-2xl animate-float-slow animation-delay-3000 opacity-60">🌸</div>
        <div className="absolute bottom-1/4 left-8 text-2xl animate-float-slow opacity-60">💝</div>
        <div className="absolute top-2/3 left-1/4 text-xl animate-sparkle-slow opacity-50">✨</div>
      </div>

      {/* Custom animations and styles */}
      <style>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; }
        }
        
        @keyframes blob-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(1.3) rotate(10deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        .animate-float-heart {
          animation: float-heart linear infinite;
        }
        
        .animate-blob-slow {
          animation: blob-slow 12s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-heart 4s ease-in-out infinite;
        }
        
        .animate-sparkle-slow {
          animation: sparkle 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        /* DatePicker Custom Styling */
        .react-datepicker {
          border: none;
          border-radius: 1.5rem;
          background: white;
          font-family: inherit;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .react-datepicker__header {
          background: linear-gradient(135deg, #f472b6 0%, #f43f5e 100%);
          border-bottom: none;
          border-radius: 1.5rem 1.5rem 0 0;
          padding: 1rem;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white;
          font-weight: 600;
        }

        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #f472b6 0%, #f43f5e 100%);
          color: white;
          border-radius: 9999px;
        }

        .react-datepicker__day:hover {
          background: #fce7f3;
          color: #f43f5e;
          border-radius: 9999px;
        }

        .react-datepicker__day--today {
          font-weight: bold;
          color: #f43f5e;
          position: relative;
        }
        
        .react-datepicker__day--today:after {
          content: '🎈';
          font-size: 10px;
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
        }

        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background: white;
          border: 1px solid #fbcfe8;
          border-radius: 1rem;
        }
        
        .react-datepicker__month-dropdown-container select,
        .react-datepicker__year-dropdown-container select {
          background: white;
          border: 1px solid #fbcfe8;
          border-radius: 0.75rem;
          padding: 0.25rem 0.5rem;
          color: #f43f5e;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .react-datepicker {
            width: 280px;
            font-size: 0.8rem;
          }
          .react-datepicker__month-container {
            width: 280px;
          }
          .react-datepicker__day {
            width: 2rem;
            line-height: 2rem;
            margin: 0.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;