import React from 'react';
import { PriorityLevel } from '../../types';

interface CircularSeverityGaugeProps {
  score: number;
  priority: PriorityLevel;
  size?: number;
  strokeWidth?: number;
  subtitle?: string;
}

export const CircularSeverityGauge: React.FC<CircularSeverityGaugeProps> = ({
  score,
  priority,
  size = 200,
  strokeWidth = 14,
  subtitle = 'AI RISK INDEX',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Priority color palettes
  const colorMap: Record<
    PriorityLevel,
    {
      stroke: string;
      glow: string;
      text: string;
      badgeBg: string;
      badgeBorder: string;
      badgeText: string;
    }
  > = {
    CRITICAL: {
      stroke: 'url(#gradient-critical)',
      glow: 'rgba(239, 68, 68, 0.25)',
      text: 'text-red-600',
      badgeBg: 'bg-red-50',
      badgeBorder: 'border-red-200',
      badgeText: 'text-red-700',
    },
    HIGH: {
      stroke: 'url(#gradient-high)',
      glow: 'rgba(249, 115, 22, 0.25)',
      text: 'text-orange-600',
      badgeBg: 'bg-orange-50',
      badgeBorder: 'border-orange-200',
      badgeText: 'text-orange-700',
    },
    MODERATE: {
      stroke: 'url(#gradient-moderate)',
      glow: 'rgba(234, 179, 8, 0.25)',
      text: 'text-amber-600',
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-200',
      badgeText: 'text-amber-800',
    },
    LOW: {
      stroke: 'url(#gradient-low)',
      glow: 'rgba(16, 185, 129, 0.25)',
      text: 'text-emerald-600',
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-200',
      badgeText: 'text-emerald-700',
    },
  };

  const currentTheme = colorMap[priority] || colorMap.CRITICAL;

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="gradient-critical" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <linearGradient id="gradient-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <linearGradient id="gradient-moderate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
            <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={currentTheme.glow} />
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeDasharray="4 4"
            className="opacity-100"
          />

          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={currentTheme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gauge-glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold mb-0.5">
            {subtitle}
          </span>
          <div className="flex items-baseline justify-center">
            <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${currentTheme.text}`}>
              {score}
            </span>
            <span className="text-slate-400 font-mono text-sm ml-1 font-bold">/ 100</span>
          </div>
          <div className="mt-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase ${currentTheme.badgeBg} ${currentTheme.badgeBorder} ${currentTheme.badgeText}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
              {priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
