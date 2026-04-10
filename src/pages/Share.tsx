import { AppLayout } from '@/components/AppLayout';
import { ShareDialog } from '@/components/ShareDialog';
import { useSharing } from '@/hooks/use-sharing';
import { useAudit } from '@/hooks/use-audit';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Clock, Eye, Shield, Copy, Plus, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Share = () => {
  const { sharedLinks, revokeLink } = useSharing();
  const { log } = useAudit();
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/shared/${id}`);
    toast.success('Link copied to clipboard');
  };

  return (
    <AppLayout title="Secure Sharing" subtitle="Share records with doctors and hospitals">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/50 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Create Secure Share Link</h3>
            <p className="text-sm text-muted-foreground mt-1">Select records and set permissions for sharing</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm shadow-glow hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> New Share Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">End-to-End Encrypted</p>
            <p className="text-xs text-muted-foreground mt-1">All shared data is encrypted in transit and at rest</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <Clock className="w-8 h-8 text-health-orange mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Auto-Expiring Links</p>
            <p className="text-xs text-muted-foreground mt-1">Links expire after the set duration for security</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 text-center">
            <Eye className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Access Tracking</p>
            <p className="text-xs text-muted-foreground mt-1">Monitor who accessed your records and when</p>
          </div>
        </div>
      </motion.div>

      <h3 className="text-lg font-bold text-foreground mb-4">Shared Links ({sharedLinks.length})</h3>
      <div className="space-y-4">
        {sharedLinks.map((link, i) => (
          <motion.div key={link.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.isActive ? 'bg-health-green/10' : 'bg-muted'}`}>
                  {link.isActive ? <CheckCircle className="w-5 h-5 text-health-green" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{link.recipientName}</p>
                  <p className="text-xs text-muted-foreground">{link.recordIds.length} record(s) · {link.permission === 'view' ? 'View only' : 'View & Download'}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setShowQR(showQR === link.id ? null : link.id)} className="px-3 py-2 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">QR Code</button>
                <button onClick={() => copyLink(link.id)} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><Copy className="w-4 h-4 text-secondary-foreground" /></button>
                {link.isActive && (
                  <button onClick={() => { revokeLink(link.id); log(`Revoked share link for ${link.recipientName}`, 'warning'); toast.success('Link revoked'); }} className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 shrink-0" /> Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 shrink-0" /> {link.accessCount} views</span>
              <span className={`px-2 py-0.5 rounded-full font-medium ${link.isActive ? 'bg-health-green/10 text-health-green' : 'bg-muted text-muted-foreground'}`}>
                {link.isActive ? 'Active' : 'Expired'}
              </span>
            </div>

            {showQR === link.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 flex justify-center">
                <div className="bg-card p-4 rounded-xl border border-border">
                  <QRCodeSVG value={`${window.location.origin}/shared/${link.id}`} size={160} level="H" className="rounded-lg" />
                  <p className="text-xs text-center text-muted-foreground mt-2">Scan to access records</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        {sharedLinks.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No shared links yet. Create one to share records.</p>
        )}
      </div>

      <ShareDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </AppLayout>
  );
};

export default Share;
