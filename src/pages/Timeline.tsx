import { AppLayout } from '@/components/AppLayout';
import { useRecords } from '@/hooks/use-records';
import { categoryConfig } from '@/lib/types';
import { motion } from 'framer-motion';

const Timeline = () => {
  const { records } = useRecords();
  const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppLayout title="Health Timeline" subtitle="Your complete medical history">
      {sorted.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No records to show in the timeline.</p>
      )}
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-0.5" />
        {sorted.map((record, i) => {
          const config = categoryConfig[record.category];
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative flex items-start mb-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
            >
              <div className="absolute left-6 lg:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 shadow-glow" />
              <div className={`ml-14 lg:ml-0 lg:w-[calc(50%-2rem)] ${isLeft ? 'lg:pr-0 lg:mr-auto' : 'lg:pl-0 lg:ml-auto'}`}>
                <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>{config.label}</span>
                  </div>
                                   <h3 className="font-semibold text-foreground break-words">{record.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 break-words">{record.doctor} · {record.hospital}</p>
                  {record.summary && <p className="text-sm text-muted-foreground mt-2 break-words">{record.summary}</p>}
                  <p className="text-xs text-primary font-medium mt-3">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Timeline;
