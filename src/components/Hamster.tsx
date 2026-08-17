import React, { useState, useEffect, useRef } from 'react';

type HamsterState = 'idle' | 'walking' | 'munching' | 'waving' | 'sleeping' | 'sniffing';

const HAMSTER_MESSAGES = [
  'Squeak squeak! 🐹💕',
  'Hamster ki Dewani! 🌸',
  'Aqsa Cutie! ✨',
  'Nom nom nom 🌻',
  'You are the best! 💖',
  'Cutest girl ever! 👑',
  'Pyaari Aqsa! 🎀',
];

const Hamster: React.FC = () => {
  const [position, setPosition] = useState({ x: 30, y: Math.max(100, window.innerHeight - 130) });
  const [state, setState] = useState<HamsterState>('idle');
  const [facingLeft, setFacingLeft] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const posRef = useRef(position);
  posRef.current = position;

  // Handle mobile window resize & boundary bounds
  useEffect(() => {
    const handleResize = () => {
      const maxX = Math.max(20, window.innerWidth - 100);
      const maxY = Math.max(100, window.innerHeight - 130);
      setPosition((prev) => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autonomous Behavior Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const changeBehavior = () => {
      const states: HamsterState[] = ['idle', 'walking', 'munching', 'waving', 'sleeping', 'sniffing'];
      const nextState = states[Math.floor(Math.random() * states.length)];
      setState(nextState);

      if (nextState === 'walking') {
        const marginX = 40;
        const newX = Math.random() * (window.innerWidth - marginX * 2 - 60) + marginX;
        const minY = Math.max(120, window.innerHeight - 200);
        const maxY = window.innerHeight - 120;
        const newY = Math.random() * (maxY - minY) + minY;

        setFacingLeft(newX < posRef.current.x);

        const duration = 2800;
        const startX = posRef.current.x;
        const startY = posRef.current.y;
        const startTime = Date.now();

        const moveInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          setPosition({
            x: startX + (newX - startX) * ease,
            y: startY + (newY - startY) * ease,
          });

          if (progress >= 1) {
            clearInterval(moveInterval);
            setState('idle');
          }
        }, 30);
      }

      timer = setTimeout(changeBehavior, Math.random() * 3500 + 3500);
    };

    timer = setTimeout(changeBehavior, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Tap or Touch Interaction
  const handleInteract = (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();

    const msg = HAMSTER_MESSAGES[Math.floor(Math.random() * HAMSTER_MESSAGES.length)];
    setMessage(msg);
    setState('waving');

    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 30,
    }));
    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setMessage(null);
    }, 2800);
  };

  return (
    <div
      className="fixed z-40 select-none touch-none pointer-events-auto transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Speech Bubble */}
      {message && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-rose-600 font-extrabold text-xs md:text-sm px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-pink-300 whitespace-nowrap animate-bounce-slow flex items-center gap-1 z-50">
          <span>{message}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r-2 border-b-2 border-pink-300"></div>
        </div>
      )}

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-pink-500 font-bold text-xl animate-float-slow pointer-events-none"
          style={{
            left: `${h.x}px`,
            top: `${-35 + h.y}px`,
          }}
        >
          💖
        </div>
      ))}

      {/* Ultra-Cute 3D Realistic Hamster Canvas/SVG Container */}
      <div
        onClick={handleInteract}
        onTouchStart={handleInteract}
        className={`relative w-24 h-24 md:w-28 md:h-28 cursor-pointer group transition-transform duration-300 hover:scale-110 active:scale-95 ${
          facingLeft ? '-scale-x-100' : ''
        }`}
        title="Tap to pet your cute Hamster! 🐹"
      >
        {/* Soft 3D Ground Shadow */}
        <div className="absolute bottom-1 left-3 right-3 h-4 bg-black/25 rounded-full blur-md group-hover:scale-110 transition-transform"></div>

        {/* 3D Rendered Hamster Vector Model */}
        <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-xl">
          <defs>
            {/* 3D Realistic Fur Gradients */}
            <radialGradient id="furMain" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="45%" stopColor="#fbbf24" />
              <stop offset="85%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>

            <radialGradient id="furHighlight" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </radialGradient>

            <radialGradient id="earInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#f43f5e" />
            </radialGradient>

            <radialGradient id="eyeGloss" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            <radialGradient id="seedGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c1917" />
            </radialGradient>
          </defs>

          {/* 3D Fluffy Ears */}
          <g className={state === 'sniffing' ? 'animate-bounce' : ''}>
            {/* Left Ear */}
            <ellipse cx="42" cy="30" rx="13" ry="15" fill="url(#furMain)" />
            <ellipse cx="42" cy="30" rx="8" ry="10" fill="url(#earInner)" />

            {/* Right Ear */}
            <ellipse cx="98" cy="30" rx="13" ry="15" fill="url(#furMain)" />
            <ellipse cx="98" cy="30" rx="8" ry="10" fill="url(#earInner)" />
          </g>

          {/* Back Little Tail */}
          <ellipse cx="22" cy="85" rx="7" ry="6" fill="#fbcfe8" />

          {/* Feet (Cute Paws with Toe Pads) */}
          <g className={state === 'walking' ? 'animate-bounce' : ''}>
            <ellipse cx="46" cy="115" rx="11" ry="7" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
            <ellipse cx="94" cy="115" rx="11" ry="7" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1" />
          </g>

          {/* Chubby 3D Body */}
          <ellipse cx="70" cy="78" rx="48" ry="40" fill="url(#furMain)" />

          {/* White Fluffy Belly & Chest */}
          <ellipse cx="70" cy="85" rx="30" ry="25" fill="url(#furHighlight)" />

          {/* Chubby Cheeks Puff */}
          <ellipse cx="42" cy="78" rx="12" ry="10" fill="#fda4af" opacity="0.65" />
          <ellipse cx="98" cy="78" rx="12" ry="10" fill="#fda4af" opacity="0.65" />

          {/* Cute Whiskers */}
          <g stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            {/* Left Whiskers */}
            <line x1="45" y1="74" x2="18" y2="68" />
            <line x1="45" y1="78" x2="16" y2="78" />
            <line x1="45" y1="82" x2="20" y2="88" />

            {/* Right Whiskers */}
            <line x1="95" y1="74" x2="122" y2="68" />
            <line x1="95" y1="78" x2="124" y2="78" />
            <line x1="95" y1="82" x2="120" y2="88" />
          </g>

          {/* Eyes (Realistic 3D Double Reflective Anime Eyes) */}
          {state === 'sleeping' ? (
            /* Sleep Eye Slits */
            <g stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 48 64 Q 54 70 60 64" />
              <path d="M 80 64 Q 86 70 92 64" />
            </g>
          ) : (
            <g>
              {/* Left Eye */}
              <circle cx="52" cy="62" r="7" fill="url(#eyeGloss)" />
              <circle cx="49" cy="59" r="3" fill="#ffffff" />
              <circle cx="54" cy="64" r="1.2" fill="#ffffff" />

              {/* Right Eye */}
              <circle cx="88" cy="62" r="7" fill="url(#eyeGloss)" />
              <circle cx="85" cy="59" r="3" fill="#ffffff" />
              <circle cx="90" cy="64" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Cute Button Nose */}
          <polygon points="70,70 65,75 75,75" fill="#f43f5e" />

          {/* Happy Mouth */}
          <path d="M 65 76 Q 70 81 75 76" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Front Paws & Accessories */}
          {state === 'waving' ? (
            /* Waving Paw Animation */
            <g>
              <ellipse cx="50" cy="88" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="102" cy="70" rx="8" ry="7" fill="#fbcfe8" className="animate-bounce" />
            </g>
          ) : state === 'munching' ? (
            /* Munching Sunflower Seed Paws */
            <g>
              <ellipse cx="62" cy="84" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="78" cy="84" rx="7" ry="6" fill="#fbcfe8" />
              {/* Sunflower Seed */}
              <ellipse cx="70" cy="82" rx="6" ry="9" fill="url(#seedGrad)" stroke="#fbbf24" strokeWidth="1.5" />
            </g>
          ) : (
            /* Default Cute Paws resting on belly */
            <g>
              <ellipse cx="54" cy="88" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="86" cy="88" rx="7" ry="6" fill="#fbcfe8" />
            </g>
          )}

          {/* Cute Tiny Crown Accessory for Aqsa */}
          <g transform="translate(62, 16) scale(0.7)">
            <polygon points="0,15 5,0 12,10 19,0 24,15" fill="#facc15" stroke="#d97706" strokeWidth="1" />
            <circle cx="5" cy="1" r="1.5" fill="#f43f5e" />
            <circle cx="12" cy="9" r="1.5" fill="#38bdf8" />
            <circle cx="19" cy="1" r="1.5" fill="#f43f5e" />
          </g>

          {/* Zzz Bubbles during Sleep */}
          {state === 'sleeping' && (
            <g className="animate-bounce">
              <text x="105" y="42" fill="#c084fc" fontSize="18" fontWeight="extrabold">
                zZ
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default Hamster;
