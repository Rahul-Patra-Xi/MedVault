import { AppLayout } from '@/components/AppLayout';
import { useAudit } from '@/hooks/use-audit';
import { motion } from 'framer-motion';
import { Shield, Key, Fingerprint, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const securityDefaults = [
  { id: 'tfa', label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account', icon: Key, enabled: true },
  { id: 'bio', label: 'Biometric Login', description: 'Use fingerprint or face recognition', icon: Fingerprint, enabled: false },
  { id: 'e2e', label: 'End-to-End Encryption', description: 'All records encrypted at rest and in transit', icon: Lock, enabled: true },
  { id: 'log', label: 'Access Logging', description: 'Track all access to your records', icon: Eye, enabled: true },
];

const Security = () => {
  const { entries } = useAudit();
  const [settings, setSettings] = useState(securityDefaults);

  const toggle = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    toast.success('Security setting updated');
  };

  const enabledCount = settings.filter(s => s.enabled).length;
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
        {settings.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-card border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.enabled ? 'bg-health-green/10' : 'bg-muted'}`}>
                <item.icon className={`w-5 h-5 ${item.enabled ? 'text-health-green' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <button onClick={() => toggle(item.id)} className={`relative w-12 h-7 rounded-full transition-colors ${item.enabled ? 'bg-health-green' : 'bg-muted'}`}>
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-transform ${item.enabled ? 'left-6' : 'left-1'}`} />
            </button>
          </motion.div>
        ))}
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
