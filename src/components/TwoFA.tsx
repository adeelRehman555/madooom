import React, { useState, useEffect } from 'react';
import { storeAuthToken } from '../lib/auth';

interface TwoFAProps {
  nickname: string;
  dob: string;
  onVerificationSuccess: () => void;
}

type OptionType = 'cute' | 'batameez' | 'beautiful';

const TwoFA: React.FC<TwoFAProps> = ({ nickname, dob, onVerificationSuccess }) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleOptionSelect = (option: OptionType) => {
    setSelectedOption(option);
    setFeedback(null);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedOption) {
      setFeedback({ text: 'Please select an option first! 🤫', isSuccess: false });
      setIsShaking(true);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (selectedOption === 'batameez') {
      setFeedback({
        text: 'You Goddam Right! 😎😈🔥',
        isSuccess: true,
      });
      storeAuthToken(nickname, dob);
      setTimeout(() => {
        onVerificationSuccess();
      }, 1200);
    } else if (selectedOption === 'cute') {
      setFeedback({
        text: 'Partially correct Hahaha 🤪😂',
        isSuccess: false,
      });
      setIsShaking(true);
    } else if (selectedOption === 'beautiful') {
      setFeedback({
        text: "It's Right you are Beautiful, But Nahh 😜👑✨",
        isSuccess: false,
      });
      setIsShaking(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  const options = [
    {
      id: 'cute' as OptionType,
      label: 'A) Cute',
      emoji: '🌸',
      subtext: 'So sweet & soft 💕',
    },
    {
      id: 'batameez' as OptionType,
      label: 'B) Batameez',
      emoji: '😈',
      subtext: 'Naughty & dramatic 😜',
    },
    {
      id: 'beautiful' as OptionType,
      label: 'C) Beautiful',
      emoji: '👑',
      subtext: 'Gorgeous queen ✨',
    },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 font-sans">
      {/* Animated background elements */}
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
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob-slow animation-delay-2000"></div>
      </div>

      <div className={`relative z-10 w-full max-w-md mx-auto px-4 ${isShaking ? 'animate-shake' : ''}`}>
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/40 animate-slide-up">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-t-3xl animate-gradient-shift"></div>
          
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-5">
              <div className="absolute inset-0 animate-bounce-slow">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <span className="text-5xl">🔐</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-sparkle">✨</div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2 animate-gradient-x">
              One Last Step
            </h1>
            <p className="text-pink-500 text-sm md:text-base font-medium mt-1">
              Answer honestly to unlock your surprise... 💖
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-6">
            <div className="space-y-3">
              <label className="text-base md:text-lg font-bold text-gray-800 flex items-center justify-center gap-2 text-center">
                <span>🤫</span> Ap Zyda Kya Ho ? <span>❓</span>
              </label>

              <div className="space-y-3 pt-2">
                {options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group text-left ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50/90 shadow-md shadow-purple-200/50 scale-[1.02]'
                          : 'border-purple-100 bg-white/70 hover:border-purple-300 hover:bg-purple-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl transition-transform group-hover:scale-110">
                          {opt.emoji}
                        </span>
                        <div>
                          <p className={`font-semibold text-sm md:text-base ${isSelected ? 'text-purple-700 font-bold' : 'text-gray-700'}`}>
                            {opt.label}
                          </p>
                          <p className="text-xs text-gray-400">{opt.subtext}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl text-sm animate-slide-in shadow-sm border-l-4 ${
                  feedback.isSuccess
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                    : 'bg-rose-50 border-rose-400 text-rose-700 font-medium'
                }`}
              >
                <span className="text-xl">{feedback.isSuccess ? '🎉' : '😜'}</span>
                <span>{feedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-400/40 hover:scale-105 active:scale-98 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Checking answer...</span>
                </>
              ) : (
                <>
                  <span>Unlock Now 🗝️</span>
                  <span className="text-lg transition-transform group-hover:translate-x-1 group-hover:scale-110">✨</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        /* Re-using animations from Login.css */
        @keyframes float-heart { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; } 50% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; } }
        @keyframes blob-slow { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -20px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
        @keyframes gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); } 20%, 40%, 60%, 80% { transform: translateX(3px); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes sparkle { 0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); } 50% { opacity: 0.5; transform: scale(1.3) rotate(10deg); } }
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-float-heart { animation: float-heart linear infinite; }
        .animate-blob-slow { animation: blob-slow 12s ease-in-out infinite; }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-shift 3s ease infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 1.5s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default TwoFA;