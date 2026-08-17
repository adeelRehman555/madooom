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

      // 5. Render Hyper-Realistic 3D BMW Sports Car
      const carScale = Math.min(width / 400, 1.25);
      const carX = width / 2;
      const carY = height * 0.72;

      ctx.save();
      ctx.translate(carX, carY);
      ctx.scale(carScale, carScale);

      // Car Engine Vibration & Nitro Shake
      const vibrationX = (Math.random() - 0.5) * (isNitro ? 4 : 1.2);
      const vibrationY = (Math.random() - 0.5) * (isNitro ? 4 : 1.2);
      ctx.translate(vibrationX, vibrationY);

      // Underglow Neon Shadow (Dual Layer for Realistic Ground Illumination)
      ctx.save();
      ctx.shadowBlur = isNitro ? 45 : 30;
      ctx.shadowColor = isNitro ? '#f43f5e' : colorRef.current.accent;
      ctx.fillStyle = isNitro ? 'rgba(244, 63, 94, 0.65)' : 'rgba(0, 163, 224, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 48, 160, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Exhaust Nitro Flames & Thruster Particle Sparkles
      if (isNitro) {
        ctx.save();
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ff2200';

        // Dual Quad Exhaust Flame Jets
        [-62, -48, 48, 62].forEach((xPos) => {
          const flameLength = Math.random() * 45 + 30;
          const flameGrad = ctx.createLinearGradient(xPos, 38, xPos, 38 + flameLength);
          flameGrad.addColorStop(0, '#ffffff');
          flameGrad.addColorStop(0.3, '#ffcc00');
          flameGrad.addColorStop(0.7, '#ff3300');
          flameGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(xPos - 6, 38);
          ctx.lineTo(xPos, 38 + flameLength);
          ctx.lineTo(xPos + 6, 38);
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // Wheels & Rim Rotors (Rendered behind body)
      ctx.save();
      // Left Rear Wheel
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(-144, 8, 18, 36, 4);
      ctx.fill();
      // Disc Brake & Red Caliper (Left)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-140, 14, 4, 24);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-140, 10, 5, 8);

      // Right Rear Wheel
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(126, 8, 18, 36, 4);
      ctx.fill();
      // Disc Brake & Red Caliper (Right)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(136, 14, 4, 24);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(135, 10, 5, 8);
      ctx.restore();

      // Main Coupe Body Silhouette (Multi-layer Metallic Gradient)
      const bodyGradient = ctx.createLinearGradient(-130, -60, 130, 60);
      bodyGradient.addColorStop(0, colorRef.current.hex);
      bodyGradient.addColorStop(0.4, colorRef.current.hex);
      bodyGradient.addColorStop(0.85, '#1e293b');
      bodyGradient.addColorStop(1, '#0f172a');

      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2.5;

      // Lower Body Contour
      ctx.beginPath();
      ctx.moveTo(-135, 20);
      ctx.quadraticCurveTo(-145, -12, -115, -34);
      ctx.quadraticCurveTo(-85, -50, -52, -60);
      ctx.lineTo(52, -60);
      ctx.quadraticCurveTo(85, -50, 115, -34);
      ctx.quadraticCurveTo(145, -12, 135, 20);
      ctx.quadraticCurveTo(125, 48, -125, 48);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Metallic Body Highlight Curve
      ctx.save();
      const highlightGrad = ctx.createLinearGradient(-120, -20, 120, -20);
      highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.45)');
      ctx.strokeStyle = highlightGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-125, -5);
      ctx.quadraticCurveTo(0, -25, 125, -5);
      ctx.stroke();
      ctx.restore();

      // Cabin / Carbon Fiber Roof
      const roofGradient = ctx.createLinearGradient(-75, -95, 75, -60);
      roofGradient.addColorStop(0, '#0f172a');
      roofGradient.addColorStop(0.5, '#1e293b');
      roofGradient.addColorStop(1, '#090d16');

      ctx.fillStyle = roofGradient;
      ctx.beginPath();
      ctx.moveTo(-72, -58);
      ctx.quadraticCurveTo(-52, -98, 0, -102);
      ctx.quadraticCurveTo(52, -98, 72, -58);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rear Windshield Glass with 3D Sunburst Reflections
      const glassGradient = ctx.createLinearGradient(-62, -90, 62, -60);
      glassGradient.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      glassGradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.85)');
      glassGradient.addColorStop(1, 'rgba(15, 23, 42, 0.95)');

      ctx.fillStyle = glassGradient;
      ctx.beginPath();
      ctx.moveTo(-62, -60);
      ctx.quadraticCurveTo(-46, -92, 0, -95);
      ctx.quadraticCurveTo(46, -92, 62, -60);
      ctx.closePath();
      ctx.fill();

      // Glass Light Reflection Streak
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.moveTo(-35, -88);
      ctx.lineTo(-10, -88);
      ctx.lineTo(-45, -64);
      ctx.lineTo(-55, -64);
      ctx.closePath();
      ctx.fill();

      // Carbon Fiber M-Performance Rear Wing Spoiler
      ctx.save();
      ctx.fillStyle = '#090d16';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#000000';
      ctx.fillRect(-115, -44, 230, 9);
      // Wing Supports
      ctx.fillRect(-105, -38, 14, 12);
      ctx.fillRect(91, -38, 14, 12);
      ctx.restore();

      // BMW Signature OLED L-Shaped Tail Lamps
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#ff1744';

      // Left OLED Tail Lamp
      ctx.beginPath();
      ctx.moveTo(-128, -8);
      ctx.lineTo(-72, -8);
      ctx.lineTo(-68, 8);
      ctx.lineTo(-122, 8);
      ctx.closePath();
      ctx.fill();

      // Inner LED Strip (Left)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-122, -4, 45, 3);

      // Right OLED Tail Lamp
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.moveTo(72, -8);
      ctx.lineTo(128, -8);
      ctx.lineTo(122, 8);
      ctx.lineTo(68, 8);
      ctx.closePath();
      ctx.fill();

      // Inner LED Strip (Right)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(77, -4, 45, 3);
      ctx.restore();

      // BMW Roundel Emblem on Trunk
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, -4, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Emblem Blue Quadrants
      ctx.fillStyle = '#0055b8';
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.arc(0, -4, 12, 0, Math.PI / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.arc(0, -4, 12, Math.PI, (Math.PI * 3) / 2);
      ctx.fill();
      ctx.restore();

      // M-Power License Plate
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-38, 14, 76, 20);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-38, 14, 76, 20);

      ctx.fillStyle = '#090d16';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BMW • AQSA', 0, 28);

      // Quad Rear Exhaust Pipes (M-Sport Diffuser)
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-75, 34, 150, 12); // Diffuser fins

      [-62, -48, 48, 62].forEach((xPos) => {
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(xPos, 38, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.arc(xPos, 38, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

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

  // 1. Synthesizes Color Change Chime Sound
  const playColorChangeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  };

  // 2. Synthesizes Turbo Nitro Boost Roar Sound
  const playNitroBoostSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Turbo Spool Whine
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(300, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);

      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Exhaust Flame Roar
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(140, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.4);

      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.55);
      osc2.stop(ctx.currentTime + 0.55);
    } catch (e) {}
  };

  // 3. Continuous Sports Engine Motor Sound Loop
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
        osc = ctx.createOscillator();
        gain = ctx.createGain();

        osc.type = 'sawtooth';
        // Base engine idling/cruising frequency (higher pitch when nitro is active)
        const freq = isBoosting ? 220 : 95;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(isBoosting ? 0.12 : 0.05, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      }
    } catch (e) {}

    return () => {
      if (osc) osc.stop();
      if (ctx) ctx.close();
    };
  }, [isBoosting]);

  // Synthesizes authentic BMW sports car dual-tone car horn sound using Web Audio API
  const playBMWHornSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();

      // Dual-tone BMW horn frequencies (~435Hz & ~365Hz with harmonics)
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(435, audioCtx.currentTime); // High Freq
      osc2.frequency.setValueAtTime(365, audioCtx.currentTime); // Low Freq

      // Envelope: fast attack, steady sustain, clean decay
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.04);
      gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime + 0.55);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.75);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(audioCtx.currentTime + 0.78);
      osc2.stop(audioCtx.currentTime + 0.78);
    } catch (err) {
      console.error('Audio play error:', err);
    }
  };

  const handleHonk = () => {
    setIsHonking(true);
    playBMWHornSound();
    setTimeout(() => setIsHonking(false), 800);
  };

  const triggerNitro = (boosting: boolean) => {
    setIsBoosting(boosting);
    if (boosting) {
      playNitroBoostSound();
    }
  };

  const nextColor = () => {
    playColorChangeSound();
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
            onMouseDown={() => triggerNitro(true)}
            onMouseUp={() => triggerNitro(false)}
            onTouchStart={() => triggerNitro(true)}
            onTouchEnd={() => triggerNitro(false)}
            onClick={() => {
              triggerNitro(true);
              setTimeout(() => triggerNitro(false), 800);
            }}
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
