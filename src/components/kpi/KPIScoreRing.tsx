import React from 'react';
import { motion } from 'motion/react';

interface KPIScoreRingProps {
  score: number; // 0 - 120
  bonusPercent: number;
  size?: number;
  strokeWidth?: number;
}

export const KPIScoreRing: React.FC<KPIScoreRingProps> = ({
  score,
  bonusPercent,
  size = 140,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score range is 0 to 120 (max 120%)
  const percentage = Math.min(120, Math.max(0, score));
  const strokeDashoffset = circumference - (percentage / 120) * circumference;

  let colorClass = '#E11D48'; // Red < 80
  let ringBgColor = 'rgba(225, 29, 72, 0.15)';
  let glowColor = 'rgba(225, 29, 72, 0.4)';
  if (score >= 100) {
    colorClass = '#10B981'; // Green ≥ 100
    ringBgColor = 'rgba(16, 185, 129, 0.15)';
    glowColor = 'rgba(16, 185, 129, 0.4)';
  } else if (score >= 80) {
    colorClass = '#C6A15B'; // Gold 80 - 99
    ringBgColor = 'rgba(198, 161, 91, 0.15)';
    glowColor = 'rgba(198, 161, 91, 0.4)';
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringBgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight leading-none"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
          Ball (max 120)
        </span>
        {bonusPercent > 0 && (
          <span className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40">
            +{bonusPercent}% bonus
          </span>
        )}
      </div>
    </div>
  );
};
