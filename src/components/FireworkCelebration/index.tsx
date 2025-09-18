"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const FireworkCelebration: React.FC = () => {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2, 
        spread: 180,
        startVelocity: 45,
        origin: { x: 0, y: 0.7 }, 
      });

      confetti({
        particleCount: 2,
        spread: 180,
        startVelocity: 45,
        origin: { x: 1, y: 0.7 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return null;
};

export default FireworkCelebration;
