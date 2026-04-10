import { INDIAN_STATES_UT, LOCATION_OPTIONS, stateIdForCityId } from '@/lib/indian-locations';

export type { LocationOption } from '@/lib/indian-locations';
export { LOCATION_OPTIONS, DEFAULT_LOCATION_ID, stateDisplayName } from '@/lib/indian-locations';

export interface BookableDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  cityId: string;
  area: string;
}

export type CityId = string;

const BOOKABLE_DOCTORS_SEED: BookableDoctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    hospital: 'City General Hospital',
    cityId: 'mumbai',
    area: 'Bandra West',
  },
  {
    id: 'd2',
    name: 'Dr. Vikram Mehta',
    specialty: 'Orthopedics',
    hospital: 'Metro Care Clinic',
    cityId: 'mumbai',
    area: 'Andheri East',
  },
  {
    id: 'd3',
    name: 'Dr. Priya Patel',
    specialty: 'Internal Medicine',
    hospital: 'HealthFirst Medical',
    cityId: 'delhi',
    area: 'Vasant Kunj',
  },
  {
    id: 'd4',
    name: 'Dr. Arjun Singh',
    specialty: 'Pediatrics',
    hospital: 'Apollo Children’s Wing',
    cityId: 'delhi',
    area: 'Dwarka',
  },
  {
    id: 'd5',
    name: 'Dr. Ananya Rao',
    specialty: 'Dermatology',
    hospital: 'Skin & Wellness Institute',
    cityId: 'bengaluru',
    area: 'Koramangala',
  },
  {
    id: 'd6',
    name: 'Dr. James Miller',
    specialty: 'Radiology',
    hospital: 'RadiologyOne Clinic',
    cityId: 'bengaluru',
    area: 'Indiranagar',
  },
  {
    id: 'd7',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Gynecology',
    hospital: 'Sunrise Women’s Hospital',
    cityId: 'hyderabad',
    area: 'Banjara Hills',
  },
  {
    id: 'd8',
    name: 'Dr. Ramesh Iyer',
    specialty: 'ENT',
    hospital: 'City Care Hospital',
    cityId: 'hyderabad',
    area: 'Gachibowli',
  },
  {
    id: 'd9',
    name: 'Dr. Lakshmi Narayanan',
    specialty: 'General Physician',
    hospital: 'Chennai Medical Centre',
    cityId: 'chennai',
    area: 'Adyar',
  },
  {
    id: 'd10',
    name: 'Dr. Fatima Khan',
    specialty: 'Endocrinology',
    hospital: 'Diabetes & Hormone Clinic',
    cityId: 'chennai',
    area: 'Velachery',
  },
];

function primaryCityForState(stateId: string) {
  return LOCATION_OPTIONS.find((l) => l.stateId === stateId);
}

function buildGeneratedDoctorsForStates(): BookableDoctor[] {
  const first = ['Asha', 'Rohit', 'Deepa', 'Vikram', 'Meera', 'Sanjay', 'Kavita', 'Anil', 'Fatima', 'Daniel', 'Nisha', 'Arun'];
  const last = ['Menon', 'Kapoor', 'Das', 'Iyer', 'Verma', 'Sharma', 'Joseph', 'Patel', 'Reddy', 'Ghosh', 'Bose', 'Nair'];
  const spec = ['General Physician', 'Internal Medicine', 'Family Medicine', 'Pediatrics', 'ENT', 'Dermatology'];
  const hosp = ['Care Hospital', 'Medical Centre', 'Health Clinic'];
  const out: BookableDoctor[] = [];
  let i = 0;
  for (const s of INDIAN_STATES_UT) {
    const loc = primaryCityForState(s.id);
    if (!loc) continue;
    if (BOOKABLE_DOCTORS_SEED.some((d) => stateIdForCityId(d.cityId) === s.id)) continue;
    const cityName = loc.label.split(',')[0].trim();
    for (let j = 1; j <= 2; j++) {
      const k = i * 2 + j;
      out.push({
        id: `d-gen-${s.id}-${j}`,
        name: `Dr. ${first[k % first.length]} ${last[(k + 3) % last.length]}`,
        specialty: spec[k % spec.length],
        hospital: `${cityName} ${hosp[k % hosp.length]}`,
        cityId: loc.id,
        area: j === 1 ? 'Central' : 'North zone',
      });
    }
    i++;
  }
  return out;
}

/** All demo doctors: seeded metros + generated coverage for every state/UT. */
export const BOOKABLE_DOCTORS: BookableDoctor[] = [
  ...BOOKABLE_DOCTORS_SEED,
  ...buildGeneratedDoctorsForStates(),
];

/** Standard clinic slots (demo). */
export const SLOT_TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
] as const;

export interface StoredAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  cityLabel: string;
  date: string;
  time: string;
  reason?: string;
  bookedAt: string;
}

export function doctorsForCity(cityId: string): BookableDoctor[] {
  return BOOKABLE_DOCTORS.filter((d) => d.cityId === cityId);
}

export function doctorsForState(stateId: string): BookableDoctor[] {
  return BOOKABLE_DOCTORS.filter((d) => stateIdForCityId(d.cityId) === stateId);
}

export function cityLabel(cityId: string): string {
  return LOCATION_OPTIONS.find((l) => l.id === cityId)?.label ?? cityId;
}

export function getAvailableSlots(
  dateStr: string,
  doctorId: string,
  booked: Pick<StoredAppointment, 'doctorId' | 'date' | 'time'>[],
): string[] {
  const slots = [...SLOT_TIMES];
  const now = new Date();
  const selected = new Date(`${dateStr}T12:00:00`);
  const isToday = selected.toDateString() === now.toDateString();

  let filtered = slots;
  if (isToday) {
    const currentMins = now.getHours() * 60 + now.getMinutes();
    filtered = slots.filter((s) => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m > currentMins + 30;
    });
  }

  const taken = new Set(
    booked.filter((b) => b.doctorId === doctorId && b.date === dateStr).map((b) => b.time),
  );
  return filtered.filter((s) => !taken.has(s));
}

export function defaultAppointmentDate(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function maxAppointmentDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split('T')[0];
}
