import { AppLayout } from '@/components/AppLayout';
import { useAudit } from '@/hooks/use-audit';
import {
  BOOKABLE_DOCTORS,
  LOCATION_OPTIONS,
  cityLabel,
  defaultAppointmentDate,
  doctorsForCity,
  getAvailableSlots,
  maxAppointmentDate,
  type BookableDoctor,
  type StoredAppointment,
} from '@/lib/appointments-data';
import { KEYS, generateId, storageGet, storageSet } from '@/lib/storage';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, MapPin, Stethoscope, User, Building2, CheckCircle2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

function loadAppointments(): StoredAppointment[] {
  return storageGet<StoredAppointment[]>(KEYS.APPOINTMENTS, []);
}

const BookAppointment = () => {
  const { log } = useAudit();
  const [cityId, setCityId] = useState<string>(LOCATION_OPTIONS[0].id);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [date, setDate] = useState(defaultAppointmentDate);
  const [time, setTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [appointments, setAppointments] = useState<StoredAppointment[]>(loadAppointments);

  const doctors = useMemo(() => doctorsForCity(cityId), [cityId]);
  const selectedDoctor = useMemo(
    () => (doctorId ? BOOKABLE_DOCTORS.find((d) => d.id === doctorId) ?? null : null),
    [doctorId],
  );

  const slots = useMemo(
    () => (doctorId ? getAvailableSlots(date, doctorId, appointments) : []),
    [date, doctorId, appointments],
  );

  const persist = useCallback((next: StoredAppointment[]) => {
    setAppointments(next);
    storageSet(KEYS.APPOINTMENTS, next);
  }, []);

  const onCityChange = (next: string) => {
    setCityId(next);
    setDoctorId(null);
    setTime(null);
  };

  const onDoctorSelect = (d: BookableDoctor) => {
    setDoctorId(d.id);
    setTime(null);
  };

  const onBook = () => {
    if (!selectedDoctor || !time) {
      toast.error('Choose a doctor and time slot');
      return;
    }
    const clash = appointments.some(
      (a) =>
        a.doctorId === selectedDoctor.id && a.date === date && a.time === time,
    );
    if (clash) {
      toast.error('That slot was just taken. Pick another time.');
      return;
    }
    const row: StoredAppointment = {
      id: generateId(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      hospital: selectedDoctor.hospital,
      cityLabel: cityLabel(cityId),
      date,
      time,
      reason: reason.trim() || undefined,
      bookedAt: new Date().toISOString(),
    };
    persist([row, ...appointments]);
    log(`Booked appointment with ${selectedDoctor.name} on ${date} at ${time}`, 'success');
    toast.success('Appointment booked');
    setTime(null);
    setReason('');
  };

  const upcoming = useMemo(() => {
    const now = new Date();
    return [...appointments]
      .filter((a) => {
        const t = new Date(`${a.date}T${a.time}:00`);
        return t.getTime() >= now.getTime() - 86400000;
      })
      .sort((a, b) => {
        const ta = new Date(`${a.date}T${a.time}:00`).getTime();
        const tb = new Date(`${b.date}T${b.time}:00`).getTime();
        return ta - tb;
      })
      .slice(0, 8);
  }, [appointments]);

  return (
    <AppLayout
      title="Book an Appointment"
      subtitle="Find available doctors by location and schedule a visit"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 space-y-6"
        >
          <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Location</h3>
            </div>
            <label className="text-sm font-medium text-foreground block mb-2">City / region</label>
            <select
              value={cityId}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm"
            >
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Only doctors practicing in this area are shown.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">Available doctors</h3>
              <span className="text-xs text-muted-foreground ml-auto">{doctors.length} in area</span>
            </div>
            {doctors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No doctors listed for this location in the demo.</p>
            ) : (
              <ul className="space-y-2">
                {doctors.map((d, i) => (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      type="button"
                      onClick={() => onDoctorSelect(d)}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        doctorId === d.id
                          ? 'border-primary bg-primary/5 shadow-glow'
                          : 'border-border/60 bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-primary shrink-0" />
                            {d.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">{d.specialty}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            {d.hospital} · {d.area}
                          </p>
                        </div>
                        {doctorId === d.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {selectedDoctor && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 shadow-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Date & time</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    min={defaultAppointmentDate()}
                    max={maxAppointmentDate()}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime(null);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Reason (optional)</label>
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. follow-up, annual check-up"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Open slots
              </p>
              {slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open slots for this day. Try another date.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        time === s
                          ? 'gradient-primary text-primary-foreground shadow-glow'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={onBook}
                disabled={!time}
                className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity"
              >
                Confirm appointment
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/50 bg-card p-5 sm:p-6 shadow-card h-fit xl:sticky xl:top-24"
        >
          <h3 className="font-bold text-foreground mb-1">Your appointments</h3>
          <p className="text-xs text-muted-foreground mb-4">Saved on this device</p>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming visits yet.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-sm"
                >
                  <p className="font-semibold text-foreground">{a.doctorName}</p>
                  <p className="text-xs text-muted-foreground">{a.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(`${a.date}T12:00:00`).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    · {a.time}
                  </p>
                  <p className="text-xs text-muted-foreground">{a.hospital}</p>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default BookAppointment;
