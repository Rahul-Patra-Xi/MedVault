import { AppLayout } from '@/components/AppLayout';
import { useAppSettings } from '@/hooks/use-app-settings';
import { useAudit } from '@/hooks/use-audit';
import type { SecurityKey } from '@/lib/app-settings';
import { motion } from 'framer-motion';
import { Shield, Key, Fingerprint, Lock, Eye, AlertTriangle, CheckCircle, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

const securityItems: {
  id: SecurityKey;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  { id: 'tfa', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account', icon: Key },
  { id: 'bio', label: 'Biometric Login', description: 'Use fingerprint or face recognition', icon: Fingerprint },
  { id: 'e2e', label: 'End-to-End Encryption', description: 'All records encrypted at rest and in transit', icon: Lock },
  { id: 'log', label: 'Access Logging', description: 'Track all access to your records', icon: Eye },
];

const Security = () => {
  const { entries } = useAudit();
  const { settings, toggleSecurity } = useAppSettings();

  const toggle = (id: SecurityKey) => {
    toggleSecurity(id);
    toast.success('Security setting updated');
  };

  const enabledCount = securityItems.filter(s => settings.security[s.id]).length;
  const score = Math.round((enabledCount / settings.length) * 100);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <AppLayout title="Security Center" subtitle="Manage your privacy and security settings">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/50 mb-8">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--health-green))" strokeWidth="8" strokeDasharray={`${score * 2.64} ${264}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{score}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement'} Security</h3>
            <p className="text-sm text-muted-foreground mt-1">{score < 100 ? 'Enable all settings for a perfect score.' : 'All security features enabled!'}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {securityItems.map((item, i) => {
          const enabled = settings.security[item.id];
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-card border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${enabled ? 'bg-health-green/10' : 'bg-muted'}`}>
                  <item.icon className={`w-5 h-5 ${enabled ? 'text-health-green' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <button type="button" onClick={() => toggle(item.id)} className={`relative w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-health-green' : 'bg-muted'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/50 mt-8">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {entries.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}
          {entries.slice(0, 10).map(entry => (
            <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
              {entry.type === 'success' && <CheckCircle className="w-4 h-4 text-health-green flex-shrink-0" />}
              {entry.type === 'warning' && <AlertTriangle className="w-4 h-4 text-health-orange flex-shrink-0" />}
              {entry.type === 'info' && <Shield className="w-4 h-4 text-primary flex-shrink-0" />}
              <p className="text-sm text-foreground flex-1">{entry.action}</p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(entry.time)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Security;
