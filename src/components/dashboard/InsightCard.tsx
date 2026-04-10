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
        'w-full min-w-0 text-left rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 sm:p-5 shadow-card',
        'transition-all duration-300 hover:shadow-card-hover hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 pr-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 tabular-nums">{value}</p>
          {subtitle ? (
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-snug break-words line-clamp-2 sm:line-clamp-none">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center shadow-glow [&_svg]:w-[1.15rem] sm:[&_svg]:w-5 [&_svg]:h-[1.15rem] sm:[&_svg]:h-5">
          {icon}
        </div>
      </div>
      {children ? <div className="mt-3 sm:mt-4 min-w-0">{children}</div> : null}
    </motion.button>
  );
}
