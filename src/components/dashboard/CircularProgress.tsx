import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;
  size?: number;
  stroke?: number;
}

export function CircularProgress({ value, size = 86, stroke = 8 }: CircularProgressProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-muted"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="transparent"
          className="stroke-primary"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute text-sm font-bold text-foreground">{normalized}%</span>
    </div>
  );
}
