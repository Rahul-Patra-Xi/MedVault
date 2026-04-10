import { useState, useRef } from 'react';
import { X, Upload, FileText, Image } from 'lucide-react';
import { useRecords } from '@/hooks/use-records';
import { useAudit } from '@/hooks/use-audit';
import type { RecordCategory } from '@/lib/types';
import { categoryConfig } from '@/lib/types';
import { toast } from 'sonner';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
}

const categories: RecordCategory[] = ['prescription', 'lab_report', 'imaging', 'vaccination', 'surgery', 'consultation'];

export function UploadDialog({ open, onClose }: UploadDialogProps) {
  const { addRecord } = useRecords();
  const { log } = useAudit();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecordCategory>('lab_report');
  const [doctor, setDoctor] = useState('');
  const [hospital, setHospital] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB for localStorage.');
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !doctor) { toast.error('Title and doctor are required'); return; }
    setLoading(true);
    try {
      const fileType = file?.type.startsWith('image') ? 'image' : 'pdf';
      addRecord({
        title,
        category,
        date,
        doctor,
        hospital,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        fileType,
        summary,
        fileData: filePreview || undefined,
        fileName: file?.name,
        fileMimeType: file?.type,
      });
      log(`Uploaded record: ${title}`, 'success');
      toast.success('Record uploaded successfully!');
      onClose();
      // Reset
      setTitle(''); setDoctor(''); setHospital(''); setSummary(''); setTags(''); setFile(null); setFilePreview(null);
    } catch {
      toast.error('Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-lg border border-border/50 w-[calc(100vw-2rem)] max-w-lg max-h-[min(90vh,90dvh)] overflow-y-auto overscroll-contain p-4 sm:p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Upload Medical Record</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g., Blood Test Results" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as RecordCategory)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm">
                {categories.map(c => <option key={c} value={c}>{categoryConfig[c].label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Doctor *</label>
              <input value={doctor} onChange={e => setDoctor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" placeholder="Dr. Smith" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Hospital</label>
              <input value={hospital} onChange={e => setHospital(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" placeholder="City Hospital" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Summary</label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Brief description..." />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" placeholder="blood, routine" />
          </div>

          {/* File upload */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Attach File (max 5MB)</label>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
              {file ? (
                <div className="flex items-center gap-3 justify-center">
                  {file.type.startsWith('image') ? <Image className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                  <span className="text-sm text-foreground">{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload PDF or image</p>
                </div>
              )}
            </button>
            {filePreview && file?.type.startsWith('image') && (
              <img src={filePreview} alt="Preview" className="mt-3 rounded-xl max-h-40 mx-auto" />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Upload Record'}
          </button>
        </form>
      </div>
    </div>
  );
}
