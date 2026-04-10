import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  colorClass?: string;
}

export function StatCard({ icon, label, value, change, colorClass = 'gradient-primary' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            change.startsWith('+') ? 'bg-health-green/10 text-health-green' : 'bg-health-red/10 text-health-red'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
