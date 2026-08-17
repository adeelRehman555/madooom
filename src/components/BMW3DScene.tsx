import React, { useEffect, useRef, useState } from 'react';

interface BMW3DSceneProps {
  onClose: () => void;
}

const CAR_COLORS = [
  { name: 'M-Power Blue', hex: '#0055b8', accent: '#00a3e0' },
  { name: 'Alpine White', hex: '#f8fafc', accent: '#38bdf8' },
  { name: 'Rose Gold', hex: '#fb7185', accent: '#f43f5e' },
  { name: 'Matte Black', hex: '#1e293b', accent: '#a855f7' },
  { name: 'Sunset Orange', hex: '#ea580c', accent: '#f97316' },
];

const BMW3DScene: React.FC<BMW3DSceneProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isBoosting, setIsBoosting] = useState(false);
  const [speed, setSpeed] = useState(140);
  const [colorIndex, setColorIndex] = useState(0);
  const [isHonking, setIsHonking] = useState(false);

  const boostRef = useRef(false);
  boostRef.current = isBoosting;

  const colorRef = useRef(CAR_COLORS[0]);
  colorRef.current = CAR_COLORS[colorIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedZ: number;
      color: string;
      type: 'speed' | 'spark' | 'heart' | 'star';
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 3 + 1,
        speedZ: Math.random() * 15 + 10,
        color: ['#f472b6', '#38bdf8', '#facc15', '#a78bfa'][Math.floor(Math.random() * 4)],
        type: Math.random() > 0.7 ? 'heart' : 'speed',
      });
    }

    let roadOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isNitro = boostRef.current;
      const currentSpeed = isNitro ? 260 : 160;
      roadOffset = (roadOffset + currentSpeed * 0.08) % 60;

      // 1. Sky & Background Gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#090d16');
      bgGradient.addColorStop(0.5, '#1e102d');
      bgGradient.addColorStop(1, '#05050a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Horizon line position
      const horizonY = height * 0.42;

      // 2. Horizon Glow & Sunset/City lights
      const horizonGlow = ctx.createRadialGradient(width / 2, horizonY, 10, width / 2, horizonY, width * 0.7);
      horizonGlow.addColorStop(0, 'rgba(244, 114, 182, 0.4)');
      horizonGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, horizonY + 50);

      // 3. 3D Perspective Road Grid
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(width / 2 - 40, horizonY);
      ctx.lineTo(width / 2 + 40, horizonY);
      ctx.lineTo(width * 1.2, height);
      ctx.lineTo(-width * 0.2, height);
      ctx.closePath();

      const roadGradient = ctx.createLinearGradient(0, horizonY, 0, height);
      roadGradient.addColorStop(0, '#0f172a');
      roadGradient.addColorStop(1, '#020617');
      ctx.fillStyle = roadGradient;
      ctx.fill();

      // Road side borders (Glowing Neon lines)
      ctx.lineWidth = 4;
      ctx.shadowBlur = 15;
      ctx.shadowColor = colorRef.current.accent;
      ctx.strokeStyle = colorRef.current.accent;

      // Left Border Line
      ctx.beginPath();
      ctx.moveTo(width / 2 - 40, horizonY);
      ctx.lineTo(-width * 0.2, height);
      ctx.stroke();

      // Right Border Line
      ctx.beginPath();
      ctx.moveTo(width / 2 + 40, horizonY);
      ctx.lineTo(width * 1.2, height);
      ctx.stroke();

      // Perspective Grid Lines (Horizontal Moving Lines)
      ctx.lineWidth = 2;
      ctx.strokeStyle = isNitro ? 'rgba(244, 63, 94, 0.6)' : 'rgba(168, 85, 247, 0.35)';

      const gridLineCount = 14;
      for (let i = 0; i < gridLineCount; i++) {
        const progress = (i * 40 + roadOffset) % (gridLineCount * 40);
        const norm = progress / (gridLineCount * 40);
        const y = horizonY + Math.pow(norm, 2.2) * (height - horizonY);

        const currentRoadWidth = 80 + Math.pow(norm, 2.2) * (width * 1.4);
        ctx.beginPath();
        ctx.moveTo(width / 2 - currentRoadWidth / 2, y);
        ctx.lineTo(width / 2 + currentRoadWidth / 2, y);
        ctx.stroke();
      }

      // Center Lane Markers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      for (let i = 0; i < gridLineCount; i += 2) {
        const progress = (i * 40 + roadOffset) % (gridLineCount * 40);
        const norm = progress / (gridLineCount * 40);
        const y1 = horizonY + Math.pow(norm, 2.2) * (height - horizonY);
        const norm2 = (progress + 20) / (gridLineCount * 40);
        const y2 = horizonY + Math.pow(norm2, 2.2) * (height - horizonY);

        ctx.beginPath();
        ctx.moveTo(width / 2, y1);
        ctx.lineTo(width / 2, y2);
        ctx.stroke();
      }

      ctx.restore();

      // 4. Render 3D Flying Speed & Star Particles
      for (let p of particles) {
        p.z -= isNitro ? p.speedZ * 2.2 : p.speedZ;
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height;
        }

        const k = 400 / p.z;
        const px = p.x * k + width / 2;
        const py = p.y * k + horizonY;
        const pSize = Math.max(0.5, p.size * k);

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.save();
          if (p.type === 'heart') {
            ctx.fillStyle = p.color;
            ctx.font = `${Math.floor(pSize * 8 + 8)}px sans-serif`;
            ctx.fillText('💖', px, py);
          } else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
            if (isNitro) {
              // Motion blur streak
              ctx.strokeStyle = p.color;
              ctx.lineWidth = pSize;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px, py + pSize * 10);
              ctx.stroke();
            }
          }
          ctx.restore();
        }
      }

      // 5. Render 3D BMW Sports Car
      const carScale = Math.min(width / 420, 1.2);
      const carX = width / 2;
      const carY = height * 0.72;

      ctx.save();
      ctx.translate(carX, carY);
      ctx.scale(carScale, carScale);

      // Car Vibration Effect
      const vibration = (Math.random() - 0.5) * (isNitro ? 3 : 1);
      ctx.translate(vibration, vibration);

      // Underglow Neon Shadow
      ctx.save();
      ctx.shadowBlur = isNitro ? 35 : 25;
      ctx.shadowColor = isNitro ? '#f43f5e' : colorRef.current.accent;
      ctx.fillStyle = isNitro ? 'rgba(244, 63, 94, 0.5)' : 'rgba(0, 163, 224, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 45, 150, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Exhaust Flames (Nitro Trail)
      if (isNitro) {
        ctx.save();
        ctx.fillStyle = '#ff4d4d';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff2200';

        // Left Flame
        ctx.beginPath();
        ctx.moveTo(-60, 40);
        ctx.lineTo(-68, 40 + Math.random() * 35 + 20);
        ctx.lineTo(-52, 40);
        ctx.fill();

        // Right Flame
        ctx.beginPath();
        ctx.moveTo(52, 40);
        ctx.lineTo(68, 40 + Math.random() * 35 + 20);
        ctx.lineTo(60, 40);
        ctx.fill();

        ctx.restore();
      }

      // Car Rear / Roof Structure
      // Main Body Base
      const bodyGradient = ctx.createLinearGradient(-120, -50, 120, 50);
      bodyGradient.addColorStop(0, colorRef.current.hex);
      bodyGradient.addColorStop(0.5, colorRef.current.hex);
      bodyGradient.addColorStop(1, '#0f172a');

      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;

      // Lower Body Silhouette
      ctx.beginPath();
      ctx.moveTo(-130, 20);
      ctx.quadraticCurveTo(-140, -10, -110, -30);
      ctx.quadraticCurveTo(-80, -45, -50, -55);
      ctx.lineTo(50, -55);
      ctx.quadraticCurveTo(80, -45, 110, -30);
      ctx.quadraticCurveTo(140, -10, 130, 20);
      ctx.quadraticCurveTo(120, 45, -120, 45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cabin / Roof (Upper Coupe Curve)
      const roofGradient = ctx.createLinearGradient(-70, -90, 70, -55);
      roofGradient.addColorStop(0, '#1e293b');
      roofGradient.addColorStop(0.5, '#334155');
      roofGradient.addColorStop(1, '#0f172a');

      ctx.fillStyle = roofGradient;
      ctx.beginPath();
      ctx.moveTo(-70, -55);
      ctx.quadraticCurveTo(-50, -95, 0, -98);
      ctx.quadraticCurveTo(50, -95, 70, -55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rear Windshield Glass
      const glassGradient = ctx.createLinearGradient(-60, -85, 60, -60);
      glassGradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      glassGradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
      ctx.fillStyle = glassGradient;
      ctx.beginPath();
      ctx.moveTo(-60, -58);
      ctx.quadraticCurveTo(-45, -88, 0, -90);
      ctx.quadraticCurveTo(45, -88, 60, -58);
      ctx.closePath();
      ctx.fill();

      // Rear Spoiler (M-Performance Wing)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-110, -40, 220, 8);
      ctx.fillRect(-105, -35, 12, 10);
      ctx.fillRect(93, -35, 12, 10);

      // BMW Signature Tail Lights (L-shape LED Tail Lamps)
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#ff1744';

      // Left Tail Lamp
      ctx.beginPath();
      ctx.moveTo(-125, -5);
      ctx.lineTo(-75, -5);
      ctx.lineTo(-70, 10);
      ctx.lineTo(-120, 10);
      ctx.closePath();
      ctx.fill();

      // Right Tail Lamp
      ctx.beginPath();
      ctx.moveTo(75, -5);
      ctx.lineTo(125, -5);
      ctx.lineTo(120, 10);
      ctx.lineTo(70, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // BMW Kidney Grille & Logo Accent on Trunk
      // BMW Roundel Emblem
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Emblem Segments (Blue & White quadrants)
      ctx.fillStyle = '#0055b8';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 11, 0, Math.PI / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 11, Math.PI, (Math.PI * 3) / 2);
      ctx.fill();

      // M-Power License Plate
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-35, 15, 70, 18);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(-35, 15, 70, 18);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BMW • AQSA', 0, 28);

      // Dual Exhaust Pipes
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(-60, 36, 8, 0, Math.PI * 2);
      ctx.arc(60, 36, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-60, 36, 5, 0, Math.PI * 2);
      ctx.arc(60, 36, 5, 0, Math.PI * 2);
      ctx.fill();

      // Rear Wheels
      ctx.fillStyle = '#090d16';
      ctx.fillRect(-142, 10, 16, 32);
      ctx.fillRect(126, 10, 16, 32);

      ctx.restore();

      // 6. Horn Sound wave Effect
      if (isHonking) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00a3e0';
        ctx.beginPath();
        ctx.arc(width / 2, carY - 20, 140, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(width / 2, carY - 20, 180, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [colorIndex]);

  // Speedometer counter effect
  useEffect(() => {
    const targetSpeed = isBoosting ? 280 : 160;
    const interval = setInterval(() => {
      setSpeed((prev) => {
        if (prev < targetSpeed) return Math.min(targetSpeed, prev + 8);
        if (prev > targetSpeed) return Math.max(targetSpeed, prev - 8);
        return prev;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isBoosting]);

  const handleHonk = () => {
    setIsHonking(true);
    setTimeout(() => setIsHonking(false), 800);
  };

  const nextColor = () => {
    setColorIndex((prev) => (prev + 1) % CAR_COLORS.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden animate-fade-in font-sans select-none">
      {/* Top Navigation & HUD Header */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30 animate-pulse">
            🏎️
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              BMW M-POWER BIRTHDAY EDITION
            </h2>
            <p className="text-xs text-blue-300/80">Customized for Aqsa Cutie ✨</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white font-bold flex items-center justify-center transition-all duration-200"
          aria-label="Close 3D View"
        >
          ✕
        </button>
      </div>

      {/* Main 3D Canvas Context */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" />

      {/* Center Birthday HUD Overlay Banner */}
      <div className="relative z-10 text-center px-4 pointer-events-none mb-auto mt-4">
        <div className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-pink-500/40 shadow-2xl animate-bounce-slow">
          <p className="text-pink-300 font-semibold text-xs md:text-sm uppercase tracking-widest">
            🎉 HAPPY BIRTHDAY AQSA 🎉
          </p>
          <h3 className="text-xl md:text-3xl font-extrabold text-white mt-0.5">
            Enjoy Your Dream BMW Ride! 🏎️💨✨
          </h3>
        </div>
      </div>

      {/* Bottom Dashboard & Mobile Controls */}
      <div className="relative z-10 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-4">
        {/* Speedometer & Status HUD */}
        <div className="flex items-center justify-between px-2">
          {/* Digital Speedometer */}
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 font-mono">
              {speed}
            </span>
            <span className="text-xs font-bold text-gray-400 uppercase">KM/H</span>
            {isBoosting && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                TURBO NITRO 🚀
              </span>
            )}
          </div>

          {/* Color Display */}
          <div className="text-right">
            <p className="text-xs text-gray-400">Current Finish</p>
            <p className="text-xs md:text-sm font-bold text-pink-300 flex items-center gap-1.5 justify-end">
              <span
                className="w-3 h-3 rounded-full inline-block border border-white/50"
                style={{ backgroundColor: CAR_COLORS[colorIndex].hex }}
              ></span>
              {CAR_COLORS[colorIndex].name}
            </p>
          </div>
        </div>

        {/* Interactive Action Control Buttons for Mobile */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto w-full">
          {/* 1. Color Changer Button */}
          <button
            onClick={nextColor}
            className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs md:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all shadow-lg"
          >
            <span className="text-lg">🎨</span>
            <span>Car Color</span>
          </button>

          {/* 2. Honk Horn Button */}
          <button
            onClick={handleHonk}
            className="py-3 px-3 rounded-2xl bg-blue-600/40 hover:bg-blue-600/60 active:scale-95 border border-blue-400/50 text-white text-xs md:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-blue-500/20"
          >
            <span className="text-lg">🔊</span>
            <span>Honk Horn</span>
          </button>

          {/* 3. Turbo Boost Button (Hold or Click) */}
          <button
            onMouseDown={() => setIsBoosting(true)}
            onMouseUp={() => setIsBoosting(false)}
            onTouchStart={() => setIsBoosting(true)}
            onTouchEnd={() => setIsBoosting(false)}
            className={`py-3 px-3 rounded-2xl border text-xs md:text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all shadow-lg ${
              isBoosting
                ? 'bg-gradient-to-r from-rose-500 to-red-600 border-rose-400 text-white scale-105 shadow-rose-500/50'
                : 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 border-pink-400/40 text-white hover:bg-pink-600/50'
            }`}
          >
            <span className="text-lg">🚀</span>
            <span>{isBoosting ? 'BOOSTING!' : 'Hold Nitro'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BMW3DScene;
