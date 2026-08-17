import React, { useState, useEffect, useRef } from 'react';

type HamsterState = 'idle' | 'walking' | 'munching' | 'waving' | 'sleeping' | 'sniffing' | 'lifted';

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
  const [position, setPosition] = useState({ x: 30, y: Math.max(100, window.innerHeight - 140) });
  const [state, setState] = useState<HamsterState>('idle');
  const [facingLeft, setFacingLeft] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef(position);
  posRef.current = position;

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  // Handle window resize boundaries
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

  // Autonomous Behavior Loop (pauses when dragging)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const changeBehavior = () => {
      if (isDraggingRef.current) {
        timer = setTimeout(changeBehavior, 3000);
        return;
      }

      const states: HamsterState[] = ['idle', 'walking', 'munching', 'waving', 'sleeping', 'sniffing'];
      const nextState = states[Math.floor(Math.random() * states.length)];
      setState(nextState);

      if (nextState === 'walking') {
        const marginX = 30;
        const newX = Math.random() * (window.innerWidth - marginX * 2 - 80) + marginX;
        const minY = Math.max(100, window.innerHeight - 220);
        const maxY = window.innerHeight - 120;
        const newY = Math.random() * (maxY - minY) + minY;

        setFacingLeft(newX < posRef.current.x);

        const duration = 2800;
        const startX = posRef.current.x;
        const startY = posRef.current.y;
        const startTime = Date.now();

        const moveInterval = setInterval(() => {
          if (isDraggingRef.current) {
            clearInterval(moveInterval);
            return;
          }

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

  // Pointer / Touch Drag Handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setState('lifted');
    setMessage('Wheee! Carry me! 🐹✨');

    dragStartRef.current = { x: clientX, y: clientY };
    posStartRef.current = { ...posRef.current };

    // Spawn heart burst on pickup
    const newHearts = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 20,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    const maxX = Math.max(10, window.innerWidth - 90);
    const maxY = Math.max(60, window.innerHeight - 100);

    const newX = Math.min(maxX, Math.max(10, posStartRef.current.x + deltaX));
    const newY = Math.min(maxY, Math.max(60, posStartRef.current.y + deltaY));

    setFacingLeft(deltaX < 0);
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    setState('waving');
    setMessage('Placed me right here! 💖');

    setTimeout(() => {
      setMessage(null);
      setState('idle');
    }, 2400);
  };

  // Mouse Listeners
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleDragMove(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      handleDragEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Touch Listeners (Mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    }
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Tap handler (when clicked quickly without dragging)
  const handleClick = () => {
    if (!isDragging) {
      const msg = HAMSTER_MESSAGES[Math.floor(Math.random() * HAMSTER_MESSAGES.length)];
      setMessage(msg);
      setState('waving');
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
      className={`fixed z-40 select-none touch-none pointer-events-auto transition-transform ${
        isDragging ? 'scale-115 cursor-grabbing z-50' : 'cursor-grab'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Speech Bubble */}
      {message && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md text-rose-600 font-extrabold text-xs md:text-sm px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-pink-300 whitespace-nowrap animate-bounce-slow flex items-center gap-1 z-50 pointer-events-none">
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

      {/* 3D Realistic Hamster Container */}
      <div
        className={`relative w-24 h-24 md:w-28 md:h-28 transition-transform duration-300 ${
          facingLeft ? '-scale-x-100' : ''
        } ${isDragging ? 'rotate-6' : ''}`}
        title="Hold & Drag to place hamster anywhere! 🐹"
      >
        {/* Soft 3D Shadow (expands when lifted) */}
        <div
          className={`absolute bottom-1 left-3 right-3 h-4 bg-black/25 rounded-full blur-md transition-all duration-200 ${
            isDragging ? 'scale-125 opacity-30 translate-y-4' : ''
          }`}
        ></div>

        {/* 3D Rendered Hamster Vector Model */}
        <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-xl">
          <defs>
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
          <g className={state === 'lifted' ? 'animate-pulse' : ''}>
            <ellipse cx="42" cy="30" rx="13" ry="15" fill="url(#furMain)" />
            <ellipse cx="42" cy="30" rx="8" ry="10" fill="url(#earInner)" />
            <ellipse cx="98" cy="30" rx="13" ry="15" fill="url(#furMain)" />
            <ellipse cx="98" cy="30" rx="8" ry="10" fill="url(#earInner)" />
          </g>

          {/* Back Little Tail */}
          <ellipse cx="22" cy="85" rx="7" ry="6" fill="#fbcfe8" />

          {/* Feet */}
          <g className={state === 'walking' || state === 'lifted' ? 'animate-bounce' : ''}>
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

          {/* Whiskers */}
          <g stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            <line x1="45" y1="74" x2="18" y2="68" />
            <line x1="45" y1="78" x2="16" y2="78" />
            <line x1="45" y1="82" x2="20" y2="88" />
            <line x1="95" y1="74" x2="122" y2="68" />
            <line x1="95" y1="78" x2="124" y2="78" />
            <line x1="95" y1="82" x2="120" y2="88" />
          </g>

          {/* Eyes */}
          {state === 'sleeping' ? (
            <g stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 48 64 Q 54 70 60 64" />
              <path d="M 80 64 Q 86 70 92 64" />
            </g>
          ) : (
            <g>
              <circle cx="52" cy="62" r="7" fill="url(#eyeGloss)" />
              <circle cx="49" cy="59" r="3" fill="#ffffff" />
              <circle cx="54" cy="64" r="1.2" fill="#ffffff" />
              <circle cx="88" cy="62" r="7" fill="url(#eyeGloss)" />
              <circle cx="85" cy="59" r="3" fill="#ffffff" />
              <circle cx="90" cy="64" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Button Nose */}
          <polygon points="70,70 65,75 75,75" fill="#f43f5e" />

          {/* Happy Mouth */}
          <path d="M 65 76 Q 70 81 75 76" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Front Paws */}
          {state === 'lifted' ? (
            /* Dangling paws when picked up */
            <g className="animate-bounce">
              <ellipse cx="45" cy="92" rx="7" ry="8" fill="#fbcfe8" />
              <ellipse cx="95" cy="92" rx="7" ry="8" fill="#fbcfe8" />
            </g>
          ) : state === 'waving' ? (
            <g>
              <ellipse cx="50" cy="88" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="102" cy="70" rx="8" ry="7" fill="#fbcfe8" className="animate-bounce" />
            </g>
          ) : state === 'munching' ? (
            <g>
              <ellipse cx="62" cy="84" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="78" cy="84" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="70" cy="82" rx="6" ry="9" fill="url(#seedGrad)" stroke="#fbbf24" strokeWidth="1.5" />
            </g>
          ) : (
            <g>
              <ellipse cx="54" cy="88" rx="7" ry="6" fill="#fbcfe8" />
              <ellipse cx="86" cy="88" rx="7" ry="6" fill="#fbcfe8" />
            </g>
          )}

          {/* Tiny Golden Crown */}
          <g transform="translate(62, 16) scale(0.7)">
            <polygon points="0,15 5,0 12,10 19,0 24,15" fill="#facc15" stroke="#d97706" strokeWidth="1" />
            <circle cx="5" cy="1" r="1.5" fill="#f43f5e" />
            <circle cx="12" cy="9" r="1.5" fill="#38bdf8" />
            <circle cx="19" cy="1" r="1.5" fill="#f43f5e" />
          </g>

          {/* Sleep Zzz Bubbles */}
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
