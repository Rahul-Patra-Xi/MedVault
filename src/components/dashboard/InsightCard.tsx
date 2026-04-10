import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function InsightCard({
  title,
  value,
  subtitle,
  icon,
  onClick,
  children,
  className,
}: InsightCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-card',
        'transition-all duration-300 hover:shadow-card-hover hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle ? <p className="text-xs text-muted-foreground mt-1">{subtitle}</p> : null}
        </div>
        <div className="w-11 h-11 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
          {icon}
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </motion.button>
  );
}
