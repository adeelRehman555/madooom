import React, { useEffect, useState } from 'react';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: number;
  delay: number;
  duration: number;
}

const Fireworks: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fireworkParticles, setFireworkParticles] = useState<FireworkParticle[]>([]);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate firework particles
    const particles: FireworkParticle[] = [];
    const colors = ['#ff6b9d', '#ff4d6d', '#ff8fa3', '#ffb3c6', '#ffc2d1', '#ff69b4', '#ff1493', '#ff85b3', '#ff99cc', '#ffb347'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 1,
      });
    }
    setFireworkParticles(particles);

    // Generate confetti pieces
    const confetti: ConfettiPiece[] = [];
    const confettiColors = ['#ff6b9d', '#ff4d6d', '#ff8fa3', '#ffb3c6', '#ffc2d1', '#ff69b4', '#ff1493', '#ffd700', '#ffa500', '#ff6347'];

    for (let i = 0; i < 150; i++) {
      confetti.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
      });
    }
    setConfettiPieces(confetti);

    // Generate floating hearts
    const floatingHearts: { id: number; x: number; delay: number; duration: number }[] = [];
    for (let i = 0; i < 40; i++) {
      floatingHearts.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
      });
    }
    setHearts(floatingHearts);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); // Fireworks will last for 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="fireworks-container">
        {/* Animated background overlay */}
        <div className="fireworks-overlay"></div>

        {/* Sparkle stars */}
        <div className="sparkle-stars">
          {[...Array(60)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="sparkle-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>

        {/* Firework bursts */}
        {fireworkParticles.map((particle) => (
          <div
            key={`firework-${particle.id}`}
            className="firework-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

        {/* Confetti pieces */}
        {confettiPieces.map((piece) => (
          <div
            key={`confetti-${piece.id}`}
            className="confetti-piece"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              backgroundColor: piece.color,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              transform: `rotate(${piece.rotation}deg)`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}

        {/* Floating hearts */}
        {hearts.map((heart) => (
          <div
            key={`heart-${heart.id}`}
            className="floating-heart"
            style={{
              left: `${heart.x}%`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            ❤️
          </div>
        ))}

        {/* Glitter text */}
        <div className="glitter-text-container">
          <div className="glitter-text">✨ HAPPY BIRTHDAY! ✨</div>
          <div className="glitter-subtext">🎉 Aqsa the Cutie🎉</div>
        </div>

        {/* Balloons */}
        <div className="balloons">
          {[...Array(12)].map((_, i) => (
            <div
              key={`balloon-${i}`}
              className="balloon"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `-50px`,
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 65%)`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 5}s`,
              }}
            >
              🎈
            </div>
          ))}
        </div>

        {/* Party popper bursts */}
        <div className="party-poppers">
          {[...Array(8)].map((_, i) => (
            <div
              key={`popper-${i}`}
              className="party-popper"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .fireworks-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .fireworks-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,200,220,0.2) 100%);
          animation: pulseGlow 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        /* Sparkle stars */
        .sparkle-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          animation: sparkleTwinkle 1.5s ease-in-out infinite;
          box-shadow: 0 0 5px rgba(255,255,255,0.8);
        }

        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        /* Firework particles */
        .firework-particle {
          position: absolute;
          border-radius: 50%;
          animation: fireworkExplosion 1s ease-out forwards;
          box-shadow: 0 0 10px currentColor;
        }

        @keyframes fireworkExplosion {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(3) translate(
              calc(${(Math.random() - 0.5) * 200}px),
              calc(${(Math.random() - 0.5) * 200}px)
            );
            opacity: 0;
          }
        }

        /* Confetti pieces */
        .confetti-piece {
          position: absolute;
          animation: confettiFall 2s ease-in forwards;
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* Floating hearts */
        .floating-heart {
          position: absolute;
          bottom: -50px;
          font-size: 24px;
          animation: floatHeartUp 3s ease-in forwards;
          filter: drop-shadow(0 0 5px rgba(255,105,180,0.5));
        }

        @keyframes floatHeartUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Glitter text */
        .glitter-text-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10000;
          animation: textGlow 1s ease-in-out infinite;
        }

        .glitter-text {
          font-size: 48px;
          font-weight: bold;
          background: linear-gradient(45deg, #ff6b9d, #ff4d6d, #ff8fa3, #ffb3c6, #ff69b4);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientShift 2s ease infinite;
          text-shadow: 0 0 20px rgba(255,105,180,0.5);
          white-space: nowrap;
        }

        .glitter-subtext {
          font-size: 24px;
          font-weight: bold;
          background: linear-gradient(45deg, #ffd700, #ffa500, #ff6b9d);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientShift 3s ease infinite;
          margin-top: 10px;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,105,180,0.3); }
          50% { text-shadow: 0 0 40px rgba(255,105,180,0.8); }
        }

        /* Balloons */
        .balloon {
          position: absolute;
          font-size: 40px;
          animation: floatBalloon 8s ease-in forwards;
          filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));
        }

        @keyframes floatBalloon {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(15deg);
            opacity: 0;
          }
        }

        /* Party poppers */
        .party-popper {
          position: absolute;
          font-size: 32px;
          animation: popAndRotate 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes popAndRotate {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .glitter-text {
            font-size: 28px;
            white-space: nowrap;
          }
          .glitter-subtext {
            font-size: 18px;
          }
          .floating-heart {
            font-size: 18px;
          }
          .balloon {
            font-size: 30px;
          }
          .party-popper {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .glitter-text {
            font-size: 20px;
            white-space: normal;
            text-align: center;
            padding: 0 10px;
          }
          .glitter-subtext {
            font-size: 14px;
          }
        }

        /* Additional burst animations */
        @keyframes burst1 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        @keyframes burst2 {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(5) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default Fireworks;
