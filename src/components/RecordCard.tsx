import { motion } from 'framer-motion';
import { MedicalRecord, categoryConfig } from '@/lib/types';
import { Calendar, User, ExternalLink } from 'lucide-react';

interface RecordCardProps {
  record: MedicalRecord;
  index?: number;
}

export function RecordCard({ record, index = 0 }: RecordCardProps) {
  const config = categoryConfig[record.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="text-2xl shrink-0">{config.icon}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors break-words">{record.title}</h3>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
        <button className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity w-8 h-8 shrink-0 rounded-lg hover:bg-secondary flex items-center justify-center">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {record.summary && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{record.summary}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 min-w-0">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1.5 min-w-0">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="break-words">{record.doctor}</span>
        </span>
      </div>

      {record.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {record.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
