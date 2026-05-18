import React, { useState, useEffect } from 'react';
import { getStoredCredentials, clearAuthToken } from '../lib/auth';
import Navbar from './Navbar';
import Fireworks from './Fireworks';
import './Fireworks.css';

interface HomeProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onLogout, onNavigate }) => {
  const credentials = getStoredCredentials();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const fireworksTimer = setTimeout(() => {
      setShowFireworks(false);
      setIsBlurred(false);
    }, 7000); // Fireworks will last for 7 seconds

    return () => clearTimeout(fireworksTimer);
  }, []);

  const [showReviewSection, setShowReviewSection] = useState(false);
  const [rating, setRating] = useState('');
  const [favoritePart, setFavoritePart] = useState('');
  const [flirtingAnswer, setFlirtingAnswer] = useState('');
  const [yearPlan, setYearPlan] = useState('');
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    clearAuthToken();
    setShowLogoutModal(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleSubmitReview = () => {
    if (!rating || !favoritePart || !flirtingAnswer || !yearPlan || !review) {
      alert('Please answer all questions before submitting! 💝');
      return;
    }

    setIsSubmitting(true);

    // Create email content
    const emailSubject = encodeURIComponent(`🎀 Birthday Gift Review from ${credentials?.nickname || 'Aniba'} 🎀`);
    const emailBody = encodeURIComponent(
      `Dear Ajadeel,\n\n` +
      `Here is the review for the birthday gift from ${credentials?.nickname || 'Aniba'}:\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 GIFT REVIEW FORM\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `1️⃣ How much will you rate this gift on scale of 10?\n` +
      `   Answer: ${rating}/10\n\n` +
      `2️⃣ Which Part you liked the most?\n` +
      `   Answer: ${favoritePart}\n\n` +
      `3️⃣ Is my flirting annoys you?\n` +
      `   Answer: ${flirtingAnswer}\n\n` +
      `4️⃣ What is the plan for this Year?\n` +
      `   Answer: ${yearPlan}\n\n` +
      `5️⃣ Give your honest review in details:\n` +
      `   Answer: ${review}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ Thank you for your honest feedback! ✨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `💝 Love you Nibi! Keep shining bright! 💝\n` +
      `📅 Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
      `⏰ Time: ${new Date().toLocaleTimeString()}\n`
    );

    // Open default email client
    window.location.href = `mailto:ajadeel229@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
    setIsSubmitting(false);
    
    // Optional: Show success message
    alert('📧 Your email client has been opened! Please send the email to complete your review. Thank you so much for your feedback! 💕');
  };

  return (
    <>
      {showFireworks && <Fireworks />}
      <Navbar currentPage="home" onLogoutClick={handleLogoutClick} onNavigate={onNavigate} />
      <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 font-sans p-4 pt-20 md:pt-24 transition-filter duration-1000 ${isBlurred ? 'blur-lg' : ''}`}>
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

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-4xl">
          {/* Header Card */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/40 animate-slide-up mb-6 md:mb-8">
            {/* Top accent gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 rounded-t-3xl animate-gradient-shift"></div>

            {/* Decorative corner elements */}
            <div className="absolute -top-3 -left-3 text-3xl md:text-4xl text-pink-400/70 animate-float-slow">🎂</div>
            <div className="absolute -top-3 -right-3 text-3xl md:text-4xl text-pink-400/70 animate-float-slow animation-delay-1000">🎁</div>
            <div className="absolute -bottom-3 -left-3 text-2xl md:text-3xl text-pink-400/50 animate-float-slow animation-delay-2000 hidden sm:block">🌸</div>

            {/* Welcome Section */}
            <div className="text-center mb-6 md:mb-10">
              <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6">
                <div className="absolute inset-0 animate-bounce-slow">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                    <span className="text-4xl md:text-6xl">🎉</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 text-xl md:text-3xl animate-sparkle">✨</div>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent mb-2 md:mb-3 animate-gradient-x">
                Happy Birthday, {credentials?.nickname || 'Nibi'}!
              </h1>
              <p className="text-rose-400 text-base md:text-xl font-semibold">
                May this be the best day for you, filled with love and joy! 💝
              </p>
            </div>
          </div>

          {/* Birthday Message Card */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/40 animate-slide-up mb-6 md:mb-8">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 rounded-t-3xl animate-gradient-shift"></div>
            <div className="absolute -top-2 -right-2 text-2xl animate-float-slow">💌</div>
            
            <div className="prose prose-pink max-w-none">
              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                Happy birthday to the cutest, modest, brightest, elegant, crimson queen, my nibi darling - Aniba gujjeri 🙂. 
                I am wishing you this birthday with great love and care 😘, you are my therapist, my mentor and my darling 💓. 
                May this day become the most happy day for you and wishing you many returns of the day.
              </p>

              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                I wanted to gift you something that would not be forgotten, would not get old, would not break, 
                or not even get lost, it will be there as it is now forever and will be for you always. So i am 
                aiming that nobody gives you anything like this 😎, and my gift is most special 😂. I hope you will 
                like it. Explore it there is everything for you, i have added all the photos and videos which i had, 
                you can upload more and save them here, i have made it fully secured and encrypted so nobody can 
                access it other than you. So don't worry about it and use it as your google drive. You got 25 GBs 😂.
              </p>

              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                I don't know how we even became friends and that was a good time, calling with you is a good time 
                pass and gossips things 😂, you are a really good, kind and pure heart person, i have seen your heart 
                when you sent me picture in once mode 😭, it is very innocent 😇. And i wanted to get more space in 
                your heart you know 😂, so don't worry about anything you will nail it one day and become a successful 
                aurat. You can share anything with me your wishes, your sorrow, your happiness everything. I got your 
                back because you know i have seen it too in once mode 😭.
              </p>

              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                I know sometimes you get breathing problem, i can give you mouth-to-mouth CPR 🥹 so you get more oxygen, 
                and i can also hold the weight on your chest if you want because sometimes you really feel low 🥺. 
                Just kidding Nibi - how much i am filtering and i don't even being scared of you why ? Why ? Why ?
              </p>

              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                I have proposed to you many times but you rejected me 😂, and i don't mind and being a friend is more 
                beautiful because there are no expectations and fights between us. But you want a dirty gujjer 🥲 over 
                a boy like me a handsome, software engineer and also hard working, you know hard working 😂, that gujjer 
                nigga will got these beautiful eyes, attractive lips, killer neck, gorgeous pair of ☹️☹️, and other things 😂. 
                He will use you, and it's better to get used, because you are so useless 😂, and always in sleep mode. 
                You will give you good ragra everyday because you always mess with mental health 😂, and he will probably 
                get angry and full fill your dark wishes 😘, that's compulsory miss Aniba 😂, BTW i will be jealous because 
                he will use you, because i also wanted to get this opportunity at least once 🙂, nahhh you shocked, i was 
                just kidding 😂, there is nothing like that, there is even more darkness 😂 , again just making fun of you 
                don't get serious, maybe i wanted this, hahahah you are getting confused but you know 😂. Just forget it, 
                that was a little dirty part, i hope you will like it and forget it. 😁
              </p>

              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                Ok, let's get serious, Happy birthday again my darling, sweetie, cutie Nibo. Be happy on this day, 
                i have added a wish list area too, so add your wishes there on this birthday and try hard to achieve them.
              </p>

              <p className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg">
                I hope you will like this gift and keep it safe 🙂, i have worked a little hard for you to impress you 
                on your special day. You can review this gift also and send it through mail to me. If you are so happy 
                and liked it and you really wanted to thanks me then send a once mode with pair of ☹️☹️, hahaha just 
                kidding 😂 but if you like to send then please 🥺, I really wanted to explore your heart 😭.
              </p>

              <p className="text-rose-600 font-bold text-center text-xl md:text-2xl mt-6 pt-4 border-t-2 border-pink-200">
                Happy Birthday Again Nibi Darling aka Abiba Azam 💕
              </p>
            </div>
          </div>

          {/* Review Section Toggle Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowReviewSection(!showReviewSection)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-pink-400/40 transition-all duration-300 hover:scale-105 active:scale-98 flex items-center gap-2 mx-auto"
            >
              <span>{showReviewSection ? '📝 Hide Review Form' : '💝 Write Your Review'}</span>
              <span className="text-xl">{showReviewSection ? '⬆️' : '⬇️'}</span>
            </button>
          </div>

          {/* Review Questions Form */}
          {showReviewSection && (
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/40 animate-slide-up mb-6 md:mb-8">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 rounded-t-3xl animate-gradient-shift"></div>
              <div className="absolute -top-2 -left-2 text-2xl animate-float-slow">📋</div>
              
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6 text-center">
                Share Your Thoughts 💭
              </h2>
              <p className="text-center text-gray-600 mb-8">Your honest feedback means the world to me!</p>

              <div className="space-y-6">
                {/* Question 1 */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">1️⃣</span> How much will you rate this gift on scale of 10?
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <button
                        key={num}
                        onClick={() => setRating(num.toString())}
                        className={`w-12 h-12 rounded-full font-bold transition-all duration-200 ${
                          rating === num.toString()
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-110'
                            : 'bg-white/80 text-gray-700 hover:bg-pink-100 border-2 border-pink-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">2️⃣</span> Which Part you liked the most?
                  </label>
                  <textarea
                    value={favoritePart}
                    onChange={(e) => setFavoritePart(e.target.value)}
                    placeholder="Tell me what touched your heart the most... 💕"
                    className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 transition-all resize-none h-24"
                  />
                </div>

                {/* Question 3 */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">3️⃣</span> Is my flirting annoys you? (put crying emoji here 😢)
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFlirtingAnswer('Yes, it annoys me sometimes 😢')}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        flirtingAnswer === 'Yes, it annoys me sometimes 😢'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 hover:bg-pink-100 border-2 border-pink-200'
                      }`}
                    >
                      Yes 😢
                    </button>
                    <button
                      onClick={() => setFlirtingAnswer('No, it makes me smile 😊')}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        flirtingAnswer === 'No, it makes me smile 😊'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 hover:bg-pink-100 border-2 border-pink-200'
                      }`}
                    >
                      No 😊
                    </button>
                    <button
                      onClick={() => setFlirtingAnswer('Sometimes it\'s funny, sometimes annoying 🤪')}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        flirtingAnswer === 'Sometimes it\'s funny, sometimes annoying 🤪'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 hover:bg-pink-100 border-2 border-pink-200'
                      }`}
                    >
                      Both 🤪
                    </button>
                  </div>
                </div>

                {/* Question 4 */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">4️⃣</span> What is the plan for this Year?
                  </label>
                  <textarea
                    value={yearPlan}
                    onChange={(e) => setYearPlan(e.target.value)}
                    placeholder="Share your goals, dreams, and plans for this amazing year... 🎯✨"
                    className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 transition-all resize-none h-24"
                  />
                </div>

                {/* Question 5 */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">5️⃣</span> Give your honest review in details
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Be honest, be detailed, be you... What did you love? What could be better? I want to hear everything! 💌"
                    className="w-full px-5 py-3 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 bg-white/80 transition-all resize-none h-32"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-pink-400/40 transition-all duration-300 hover:scale-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>📧 Send Review via Email</span>
                      <span className="text-xl">💌</span>
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Your review will open in your email client. Just click send to share your thoughts with me! 💕
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Decorations */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-20 left-3 text-2xl md:text-4xl animate-float-slow opacity-70">🎀</div>
          <div className="absolute bottom-32 right-3 text-2xl md:text-4xl animate-float-slow animation-delay-1500 opacity-70">🎈</div>
          <div className="absolute top-1/3 right-5 text-xl md:text-3xl animate-float-slow animation-delay-3000 opacity-60 hidden sm:block">🌸</div>
          <div className="absolute bottom-1/4 left-4 text-xl md:text-3xl animate-float-slow opacity-60">💝</div>
          <div className="absolute top-2/3 left-1/4 text-lg md:text-2xl animate-sparkle-slow opacity-50 hidden sm:block">✨</div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl animate-scale-up overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400"></div>
            
            <div className="p-6 md:p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center animate-bounce-slow">
                <span className="text-4xl">💔</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Wait! Don't Go!</h3>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You'll need to verify your birthday again to come back.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-400/40 transition-all duration-300 hover:scale-105 active:scale-98"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-98"
                >
                  Cancel, Stay
                </button>
              </div>
            </div>
            
            <div className="absolute -bottom-2 -left-2 text-2xl opacity-30 animate-float-slow">🎀</div>
            <div className="absolute -top-2 -right-2 text-2xl opacity-30 animate-float-slow animation-delay-1000">🌸</div>
          </div>
        </div>
      )}

      {/* Styles */}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
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
        
        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
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
      `}</style>
    </>
  );
};

export default Home;