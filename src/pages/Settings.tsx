import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/hooks/use-auth';
import { useAudit } from '@/hooks/use-audit';
import { motion } from 'framer-motion';
import { User, Bell, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { storageClear } from '@/lib/storage';
import { toast } from 'sonner';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { log } = useAudit();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [bloodType, setBloodType] = useState(user?.bloodType || 'O+');

  const saveProfile = () => {
    updateProfile({ name, phone, dob, bloodType });
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
      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">{initials}</div>
            <div>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <input className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
              <input className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Date of Birth</label>
              <input className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" value={dob} onChange={e => setDob(e.target.value)} type="date" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Blood Type</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm" value={bloodType} onChange={e => setBloodType(e.target.value)}>
                <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>
          <button onClick={saveProfile} className="mt-4 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm shadow-glow hover:opacity-90 transition-opacity">Save Profile</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
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
