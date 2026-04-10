import { useState } from 'react';
import { X } from 'lucide-react';
import { useRecords } from '@/hooks/use-records';
import { useSharing } from '@/hooks/use-sharing';
import { useAudit } from '@/hooks/use-audit';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ open, onClose }: ShareDialogProps) {
  const { records } = useRecords();
  const { createShareLink } = useSharing();
  const { log } = useAudit();
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [permission, setPermission] = useState<'view' | 'download'>('view');
  const [expiryDays, setExpiryDays] = useState(7);

  if (!open) return null;

  const toggle = (id: string) => {
    setSelectedRecords(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    if (!selectedRecords.length) { toast.error('Select at least one record'); return; }
    if (!recipientName) { toast.error('Recipient name is required'); return; }
    createShareLink(selectedRecords, recipientName, permission, expiryDays);
    log(`Shared ${selectedRecords.length} record(s) with ${recipientName}`, 'info');
    toast.success(`Share link created for ${recipientName}`);
    setSelectedRecords([]); setRecipientName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-lg border border-border/50 w-[calc(100vw-2rem)] max-w-lg max-h-[min(90vh,90dvh)] overflow-y-auto overscroll-contain p-4 sm:p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Create Share Link</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Recipient Name *</label>
            <input value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" placeholder="Dr. Smith" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Permission</label>
              <select value={permission} onChange={e => setPermission(e.target.value as 'view' | 'download')} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm">
                <option value="view">View only</option>
                <option value="download">View & Download</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Expires in</label>
              <select value={expiryDays} onChange={e => setExpiryDays(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm">
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Select Records</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {records.map(r => (
                <label key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors">
                  <input type="checkbox" checked={selectedRecords.includes(r.id)} onChange={() => toggle(r.id)} className="rounded border-border accent-primary" />
                  <span className="text-sm text-foreground">{r.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{new Date(r.date).toLocaleDateString()}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleCreate} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity">
            Create Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
