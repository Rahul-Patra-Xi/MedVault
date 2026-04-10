import { AppLayout } from '@/components/AppLayout';
import { RecordCard } from '@/components/RecordCard';
import { RecordDetail } from '@/components/RecordDetail';
import { UploadDialog } from '@/components/UploadDialog';
import { useRecords } from '@/hooks/use-records';
import { categoryConfig } from '@/lib/types';
import type { RecordCategory, MedicalRecord } from '@/lib/types';
import { useState } from 'react';
import { Upload, Grid3X3, List, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const categories: (RecordCategory | 'all')[] = ['all', 'prescription', 'lab_report', 'imaging', 'vaccination', 'surgery', 'consultation'];

const Records = () => {
  const { records, deleteRecord } = useRecords();
  const [activeCategory, setActiveCategory] = useState<RecordCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filtered = records
    .filter(r => activeCategory === 'all' || r.category === activeCategory)
    .filter(r => {
      if (!search) return true;
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.doctor.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q));
    });

  return (
    <AppLayout title="Medical Records" subtitle={`${records.length} records stored securely`}>
      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/50 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, doctor, or tag..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat === 'all' ? 'All' : categoryConfig[cat].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4 text-foreground" /> : <Grid3X3 className="w-4 h-4 text-foreground" />}
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm shadow-glow hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Upload Record
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}
        >
          {filtered.map((record, i) => (
            <div key={record.id} onClick={() => setSelectedRecord(record)}>
              <RecordCard record={record} index={i} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No records found.</p>
        </div>
      )}

      <UploadDialog open={showUpload} onClose={() => setShowUpload(false)} />

      {selectedRecord && (
        <RecordDetail
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDelete={(id) => { deleteRecord(id); setSelectedRecord(null); toast.success('Record deleted'); }}
        />
      )}
    </AppLayout>
  );
};

export default Records;
