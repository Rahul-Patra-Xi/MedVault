import { AppLayout } from '@/components/AppLayout';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { RecordCard } from '@/components/RecordCard';
import { RecordDetail } from '@/components/RecordDetail';
import { useRecords } from '@/hooks/use-records';
import { useDashboardDemo } from '@/hooks/use-dashboard-demo';
import type { MedicalRecord } from '@/lib/types';
import { FileText, Pill, Share2, Shield, AlertTriangle, TrendingUp, Activity, Plus, ArrowRight, Sparkles, ClipboardCopy, Ban, Info, Building2, Clock3, CheckCircle2, MapPin, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LocationStateField } from '@/components/LocationStateField';
import { DEFAULT_STATE_ID, normalizeStateId } from '@/lib/indian-locations';
import { getConsultantsNearState } from '@/lib/consultants-data';
import { KEYS, storageGet, storageSet } from '@/lib/storage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { QRCodeSVG } from 'qrcode.react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const Dashboard = () => {
  const { records, deleteRecord } = useRecords();
  const { isGuest } = useAuth();
  const { data: dashboardData, toggleMedicationTaken, revokeShare } = useDashboardDemo();
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeDialog, setActiveDialog] = useState<'records' | 'medications' | 'shares' | 'security' | null>(null);
  const [emergencyQrOpen, setEmergencyQrOpen] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const emergencyQrUrl = useMemo(() => `${window.location.origin}/shared/emergency-demo`, []);

  const [consultantStateId, setConsultantStateId] = useState(() =>
    normalizeStateId(storageGet<string>(KEYS.CONSULTANTS_NEARBY_CITY, DEFAULT_STATE_ID)),
  );
  const nearbyConsultants = useMemo(
    () => getConsultantsNearState(consultantStateId, 6),
    [consultantStateId],
  );

  const setNearbyState = (id: string) => {
    const next = normalizeStateId(id);
    setConsultantStateId(next);
    storageSet(KEYS.CONSULTANTS_NEARBY_CITY, next);
  };

  const recentRecords = records.slice(0, 4);
  const recordTotalFromDemo = useMemo(() => {
    const b = dashboardData.recordBreakdown;
    return b.prescriptions + b.labReports + b.imaging + b.others;
  }, [dashboardData.recordBreakdown]);
  const activeDemoShares = dashboardData.shares.filter(share => share.isActive);
  const shareHistory = dashboardData.shares.filter(share => !share.isActive);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoadingCards(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const copyShareLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Share link copied');
    } catch {
      toast.error('Unable to copy link');
    }
  };

  return (
    <AppLayout title="Dashboard" subtitle="Your health at a glance">
      {/* Welcome banner */}
      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Welcome!</span> Sign in to save your data and unlock all features.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
          >
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Stats */}
      <TooltipProvider>
        {isLoadingCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map(card => (
              <div key={card} className="rounded-2xl border border-border/50 p-4 sm:p-5">
                <Skeleton className="h-5 w-1/2 mb-4" />
                <Skeleton className="h-8 w-20 mb-3" />
                <Skeleton className="h-3 w-11/12 mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <motion.div variants={item}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <InsightCard
                      title="Total Records"
                      value={recordTotalFromDemo}
                      subtitle={`${dashboardData.recordBreakdown.prescriptions} prescriptions, ${dashboardData.recordBreakdown.labReports} labs`}
                      icon={<FileText className="w-5 h-5" />}
                      onClick={() => setActiveDialog('records')}
                      className="bg-gradient-to-br from-primary/10 via-background to-background"
                    >
                      <div className="space-y-2">
                        {[
                          { label: 'Prescriptions', value: dashboardData.recordBreakdown.prescriptions },
                          { label: 'Lab Reports', value: dashboardData.recordBreakdown.labReports },
                          { label: 'Imaging', value: dashboardData.recordBreakdown.imaging },
                          { label: 'Others', value: dashboardData.recordBreakdown.others },
                        ].map(segment => (
                          <div key={segment.label} className="flex items-center justify-between gap-2 text-[11px] sm:text-xs min-w-0">
                            <span className="text-muted-foreground truncate">{segment.label}</span>
                            <span className="font-semibold text-foreground shrink-0 tabular-nums">{segment.value}</span>
                          </div>
                        ))}
                      </div>
                    </InsightCard>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tap to view full record analytics</TooltipContent>
              </Tooltip>
            </motion.div>
            <motion.div variants={item}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <InsightCard
                      title="Active Medications"
                      value={dashboardData.medications.filter(med => med.status === 'active').length}
                      subtitle="Adherence and schedule tracker"
                      icon={<Pill className="w-5 h-5" />}
                      onClick={() => setActiveDialog('medications')}
                      className="bg-gradient-to-br from-health-green/10 via-background to-background"
                    >
                      <div className="space-y-2">
                        {dashboardData.medications.slice(0, 2).map(med => (
                          <div key={med.id} className="flex items-center justify-between gap-2 text-[11px] sm:text-xs min-w-0">
                            <span className="truncate text-muted-foreground min-w-0">{med.name}</span>
                            <span className={`font-semibold ${med.status === 'active' ? 'text-health-green' : 'text-muted-foreground'}`}>
                              {med.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </InsightCard>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tap to update medication intake</TooltipContent>
              </Tooltip>
            </motion.div>
            <motion.div variants={item}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <InsightCard
                      title="Active Shares"
                      value={activeDemoShares.length}
                      subtitle={`${shareHistory.length} past shares`}
                      icon={<Share2 className="w-5 h-5" />}
                      onClick={() => setActiveDialog('shares')}
                      className="bg-gradient-to-br from-health-purple/10 via-background to-background"
                    >
                      <div className="space-y-2">
                        {activeDemoShares.slice(0, 2).map(share => (
                          <div key={share.id} className="flex items-center justify-between gap-2 text-[11px] sm:text-xs min-w-0">
                            <span className="truncate text-muted-foreground min-w-0">{share.sharedWith}</span>
                            <span className="font-semibold text-foreground shrink-0 text-right max-w-[45%] truncate">{share.expiryText}</span>
                          </div>
                        ))}
                      </div>
                    </InsightCard>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tap for share links and revocation</TooltipContent>
              </Tooltip>
            </motion.div>
            <motion.div variants={item}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <InsightCard
                      title="Security Score"
                      value={`${dashboardData.security.score}%`}
                      subtitle="Protection status overview"
                      icon={<Shield className="w-5 h-5" />}
                      onClick={() => setActiveDialog('security')}
                      className="bg-gradient-to-br from-accent/15 via-background to-background"
                    >
                      <div className="h-2 w-full rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dashboardData.security.score}%` }}
                          transition={{ duration: 0.9 }}
                          className="h-2 rounded-full gradient-primary"
                        />
                      </div>
                    </InsightCard>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tap for security checklist and tips</TooltipContent>
              </Tooltip>
            </motion.div>
          </motion.div>
        )}
      </TooltipProvider>

      <div className="space-y-8 sm:space-y-10 min-w-0">
        {/* Recent records — full width first */}
        <section className="space-y-3 sm:space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground">Recent Records</h3>
            <button onClick={() => navigate('/records')} className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1 shrink-0">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {records.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-card border border-dashed border-border"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-semibold mb-1">No records yet</p>
              <p className="text-sm text-muted-foreground mb-4 text-center">Upload your first medical record to get started.</p>
              <button
                onClick={() => navigate('/records')}
                className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-glow hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Upload Record
              </button>
            </motion.div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {recentRecords.map((record, i) => (
                <motion.div key={record.id} variants={item} onClick={() => setSelectedRecord(record)} className="cursor-pointer">
                  <RecordCard record={record} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Best Consultants — filtered by nearby location (demo) */}
        <section className="space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-primary shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-foreground">Best Consultants</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Top-rated specialists near your selected area (demo data).
              </p>
            </div>
            <div className="w-full sm:max-w-md min-w-0 space-y-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> State / Union Territory
              </span>
              <LocationStateField stateId={consultantStateId} onStateChange={setNearbyState} label="" />
            </div>
          </div>

          {nearbyConsultants.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center rounded-xl border border-dashed border-border">
              No consultants in this state for the demo. Try another state.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              {nearbyConsultants.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="rounded-2xl border border-border/60 bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow min-w-0 flex flex-col"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-accent text-accent-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {c.name.replace('Dr. ', '').split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground leading-tight break-words">{c.name}</p>
                      <p className="text-xs text-primary font-medium mt-0.5">{c.specialty}</p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <Star className="w-3.5 h-3.5 fill-health-orange text-health-orange shrink-0" />
                        <span className="text-sm font-semibold text-foreground tabular-nums">{c.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({c.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="break-words">{c.hospital} · {c.area}</span>
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      ~{c.distanceKm.toFixed(1)} km away
                    </span>
                    <span className="text-[11px] text-muted-foreground">{c.yearsExperience}+ yrs exp.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/appointments')}
                    className="mt-3 w-full py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15 transition-colors"
                  >
                    Book appointment
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* AI Summary + Emergency — full-width two columns on large screens */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 min-w-0 w-full">
          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-4 sm:p-6 bg-card shadow-card border border-border/50 min-w-0 w-full flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Activity className="w-5 h-5 text-primary shrink-0" />
              <h3 className="text-base sm:text-lg font-bold text-foreground">AI Health Summary</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-h-0">
              <div className="p-3 sm:p-4 rounded-xl bg-health-green/5 border border-health-green/20 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-health-green shrink-0" />
                  <span className="text-sm font-semibold text-health-green">Good</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Blood work values are within normal range.</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-health-orange/5 border border-health-orange/20 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-health-orange shrink-0" />
                  <span className="text-sm font-semibold text-health-orange">Attention</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">LDL cholesterol slightly elevated. Consider dietary adjustments.</p>
              </div>
            </div>
          </motion.div>

          {/* Emergency card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-4 sm:p-6 gradient-hero text-primary-foreground shadow-glow min-w-0 w-full flex flex-col"
          >
            <h3 className="font-bold text-base sm:text-lg mb-2">Emergency Access</h3>
            <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 max-w-2xl">Quick access to your critical health info in emergencies.</p>
            <button
              type="button"
              onClick={() => setEmergencyQrOpen(true)}
              className="mb-3 sm:mb-4 w-full rounded-xl bg-card/20 backdrop-blur-sm p-3 sm:p-4 border border-white/20 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 transition-colors hover:bg-card/30 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              aria-label="Open emergency QR code full size for scanning"
            >
              <div className="bg-white p-2 sm:p-3 rounded-lg shrink-0 ring-2 ring-white/30 shadow-sm">
                <QRCodeSVG
                  value={emergencyQrUrl}
                  size={88}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold">Emergency QR</p>
                <p className="text-xs sm:text-sm opacity-90 break-words mt-1">Scan for allergies, meds, and emergency contacts.</p>
                <p className="text-[11px] opacity-80 mt-2 font-medium">Tap to enlarge for scanning</p>
              </div>
            </button>
            <button type="button" className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-card/20 hover:bg-card/30 text-xs sm:text-sm font-semibold transition-colors backdrop-blur-sm mt-auto">
              Configure Emergency Card
            </button>
          </motion.div>
        </section>
      </div>

      {selectedRecord && (
        <RecordDetail
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDelete={(id) => { deleteRecord(id); setSelectedRecord(null); toast.success('Record deleted'); }}
        />
      )}

      <Dialog open={emergencyQrOpen} onOpenChange={setEmergencyQrOpen}>
        <DialogContent className="max-w-[min(24rem,calc(100vw-1.5rem))] bg-background border border-border p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle>Emergency QR code</DialogTitle>
            <DialogDescription>
              Hold your device steady and scan at a comfortable distance. Close when finished.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2 overflow-x-auto">
            <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-lg max-w-full">
              <QRCodeSVG value={emergencyQrUrl} size={260} level="H" includeMargin className="max-w-[min(260px,calc(100vw-4rem))] h-auto w-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'records'} onOpenChange={(open) => setActiveDialog(open ? 'records' : null)}>
        <DialogContent className="max-w-[min(48rem,calc(100vw-1.5rem))] bg-background/95 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle>Total Records Analytics</DialogTitle>
            <DialogDescription>Category breakdown, recent uploads, and distribution insights.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'Prescriptions', value: dashboardData.recordBreakdown.prescriptions },
                { label: 'Lab Reports', value: dashboardData.recordBreakdown.labReports },
                { label: 'Imaging', value: dashboardData.recordBreakdown.imaging },
                { label: 'Others', value: dashboardData.recordBreakdown.others },
              ].map(entry => (
                <div key={entry.label} className="rounded-xl border border-border/70 p-2.5 sm:p-3 bg-card/60 min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight line-clamp-2">{entry.label}</p>
                  <p className="text-lg sm:text-xl font-bold text-foreground mt-1 tabular-nums">{entry.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border/70 p-4 bg-card/50">
              <p className="text-sm font-semibold text-foreground mb-3">Category Distribution</p>
              <div className="space-y-3">
                {[
                  { label: 'Prescriptions', value: dashboardData.recordBreakdown.prescriptions, color: 'bg-primary' },
                  { label: 'Lab Reports', value: dashboardData.recordBreakdown.labReports, color: 'bg-health-green' },
                  { label: 'Imaging', value: dashboardData.recordBreakdown.imaging, color: 'bg-health-purple' },
                  { label: 'Others', value: dashboardData.recordBreakdown.others, color: 'bg-health-orange' },
                ].map(itemEntry => (
                  <div key={itemEntry.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{itemEntry.label}</span>
                      <span className="font-medium text-foreground">{itemEntry.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(itemEntry.value / recordTotalFromDemo) * 100}%` }}
                        className={`h-2 ${itemEntry.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 p-4 bg-card/50">
              <p className="text-sm font-semibold text-foreground mb-3">Recent Uploads</p>
              <div className="space-y-2">
                {dashboardData.recentUploads.slice(0, 3).map(upload => (
                  <div key={upload.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-x-2 rounded-lg border border-border/60 px-3 py-2 min-w-0">
                    <span className="text-sm text-foreground break-words">{upload.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{upload.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setActiveDialog(null); navigate('/records'); }}
              className="w-full md:w-auto px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold"
            >
              View All Records
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'medications'} onOpenChange={(open) => setActiveDialog(open ? 'medications' : null)}>
        <DialogContent className="max-w-[min(48rem,calc(100vw-1.5rem))] bg-background/95 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle>Medication Adherence</DialogTitle>
            <DialogDescription>Track doses, status, and next reminders in one place.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {dashboardData.medications.map(med => (
              <div key={med.id} className="rounded-xl border border-border/70 p-3 sm:p-4 bg-card/60 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground break-words">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} • {med.timing}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${med.status === 'active' ? 'bg-health-green/10 text-health-green' : 'bg-muted text-muted-foreground'}`}>
                    {med.status}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
                  <div className="text-xs text-primary bg-primary/10 rounded-full px-2 py-1 w-fit">
                    {med.nextDoseText ?? 'No pending reminder'}
                  </div>
                  <button
                    onClick={() => toggleMedicationTaken(med.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${med.takenToday ? 'bg-muted text-foreground' : 'bg-health-green text-white'}`}
                  >
                    {med.takenToday ? 'Mark as not taken' : 'Mark as taken'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'shares'} onOpenChange={(open) => setActiveDialog(open ? 'shares' : null)}>
        <DialogContent className="max-w-[min(56rem,calc(100vw-1.5rem))] bg-background/95 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle>Active Shares</DialogTitle>
            <DialogDescription>Manage access links, expiry windows, and share history.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              {activeDemoShares.map(share => (
                <div key={share.id} className="rounded-xl border border-border/70 p-3 sm:p-4 bg-card/60 min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground break-words">{share.sharedWith}</p>
                      <p className="text-xs text-muted-foreground flex items-start gap-1 mt-0.5"><Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> <span className="break-words">{share.hospital}</span></p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-flex items-center gap-1 w-fit shrink-0">
                      <Clock3 className="w-3.5 h-3.5 shrink-0" /> {share.expiryText}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg border border-border/60 bg-background/60 text-xs text-muted-foreground truncate">
                    {share.link}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => copyShareLink(share.link)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                      <ClipboardCopy className="w-3.5 h-3.5" /> Copy Link
                    </button>
                    <button onClick={() => revokeShare(share.id)} className="px-3 py-1.5 rounded-lg bg-health-red/15 text-health-red text-xs font-semibold flex items-center gap-1">
                      <Ban className="w-3.5 h-3.5" /> Revoke Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-border/70 p-4 bg-card/60">
                <p className="text-sm font-semibold text-foreground mb-2">QR Preview (Mock)</p>
                <div className="w-36 h-36 rounded-xl border border-border mx-auto bg-[linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:12px_12px]" />
              </div>
              <div className="rounded-xl border border-border/70 p-4 bg-card/60">
                <p className="text-sm font-semibold text-foreground mb-2">Past Shares</p>
                <div className="space-y-2">
                  {shareHistory.map(share => (
                    <div key={share.id} className="rounded-lg border border-border/60 p-2">
                      <p className="text-sm text-foreground">{share.sharedWith}</p>
                      <p className="text-xs text-muted-foreground">{share.hospital} • {share.expiryText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'security'} onOpenChange={(open) => setActiveDialog(open ? 'security' : null)}>
        <DialogContent className="max-w-[min(48rem,calc(100vw-1.5rem))] bg-background/95 backdrop-blur-xl border border-white/20">
          <DialogHeader>
            <DialogTitle>Security Posture</DialogTitle>
            <DialogDescription>Current protection status and recommended improvements.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 items-center">
            <div className="mx-auto">
              <CircularProgress value={dashboardData.security.score} />
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${dashboardData.security.score}%` }} className="h-2 gradient-primary" />
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-4 h-4 text-health-green" /> Encryption: Enabled</p>
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-4 h-4 text-health-green" /> Backup: Enabled</p>
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-4 h-4 text-health-green" /> Password Strength: {dashboardData.security.passwordStrength}</p>
              </div>
              <div className="rounded-lg border border-health-orange/40 bg-health-orange/5 p-3 text-sm text-health-orange flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5" />
                <span>{dashboardData.security.suggestions[0]}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Dashboard;
