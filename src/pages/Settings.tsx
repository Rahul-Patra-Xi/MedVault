import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/hooks/use-auth';
import { useAudit } from '@/hooks/use-audit';
import { INDIAN_STATES_UT } from '@/lib/indian-locations';
import { motion } from 'framer-motion';
import { User, Bell, Download, Trash2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { storageClear } from '@/lib/storage';
import { toast } from 'sonner';

const fieldInputClass =
  'w-full min-h-[2.75rem] sm:min-h-0 px-3 sm:px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-base sm:text-sm';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { log } = useAudit();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [bloodType, setBloodType] = useState(user?.bloodType || 'O+');
  const [addressLine, setAddressLine] = useState(user?.addressLine || '');
  const [addressStateId, setAddressStateId] = useState(user?.addressStateId || 'maharashtra');
  const [addressPin, setAddressPin] = useState(user?.addressPin || '');

  const saveProfile = () => {
    updateProfile({
      name,
      phone,
      dob,
      bloodType,
      addressLine: addressLine.trim() || undefined,
      addressStateId,
      addressPin: addressPin.trim() || undefined,
    });
    log('Profile updated', 'success');
    toast.success('Profile saved');
  };

  const handleExport = () => {
    const data = {
      records: localStorage.getItem('medvault_records'),
      medications: localStorage.getItem('medvault_medications'),
      sharedLinks: localStorage.getItem('medvault_shared_links'),
      appointments: localStorage.getItem('medvault_appointments'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'medvault-export.json'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure? This will delete all your data.')) {
      storageClear();
      logout();
      toast.success('Account deleted');
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <AppLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-2xl space-y-6 min-w-0 px-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 min-w-0">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">{initials}</div>
            <div>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0">
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <input className={fieldInputClass} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="min-w-0">
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
              <input className={fieldInputClass} value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="min-w-0">
              <label className="text-sm font-medium text-foreground block mb-1.5">Date of Birth</label>
              <input className={fieldInputClass} value={dob} onChange={e => setDob(e.target.value)} type="date" />
            </div>
            <div className="min-w-0">
              <label className="text-sm font-medium text-foreground block mb-1.5">Blood Type</label>
              <select className={fieldInputClass} value={bloodType} onChange={e => setBloodType(e.target.value)}>
                <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" /> Address
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-1.5">Street / building</label>
                <input
                  className={fieldInputClass}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="House no., street, landmark"
                  autoComplete="street-address"
                />
              </div>
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground block mb-1.5">State / Union Territory</label>
                <select
                  className={fieldInputClass}
                  value={addressStateId}
                  onChange={(e) => setAddressStateId(e.target.value)}
                >
                  {INDIAN_STATES_UT.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 max-w-xs">
                <label className="text-sm font-medium text-foreground block mb-1.5">PIN code</label>
                <input
                  className={fieldInputClass}
                  value={addressPin}
                  onChange={(e) => setAddressPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6 digits"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </div>
            </div>
          </div>

          <button onClick={saveProfile} className="mt-4 w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm shadow-glow hover:opacity-90 transition-opacity">Save Profile</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 min-w-0">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h3>
          {['Medication reminders', 'Appointment reminders', 'Record sharing alerts', 'Security alerts'].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
              <span className="text-sm text-foreground">{item}</span>
              <button className="relative w-12 h-7 rounded-full bg-health-green transition-colors">
                <div className="absolute top-1 left-6 w-5 h-5 rounded-full bg-card shadow-sm" />
              </button>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 min-w-0">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-primary" /> Data Management</h3>
          <div className="space-y-3">
            <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground">
              <Download className="w-4 h-4" /> Export All Records
            </button>
            <button onClick={handleDeleteAccount} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors text-sm font-medium text-destructive">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Settings;
