import { INDIAN_STATES_UT, LOCATION_OPTIONS, stateIdForCityId } from '@/lib/indian-locations';

export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  cityId: string;
  area: string;
  /** 1–5 */
  rating: number;
  reviewCount: number;
  /** Dummy distance for “nearby” demo */
  distanceKm: number;
  yearsExperience: number;
}

const TOP_CONSULTANTS_SEED: Consultant[] = [
  {
    id: 'c1',
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    hospital: 'City General Hospital',
    cityId: 'mumbai',
    area: 'Bandra West',
    rating: 4.9,
    reviewCount: 428,
    distanceKm: 1.2,
    yearsExperience: 18,
  },
  {
    id: 'c2',
    name: 'Dr. Vikram Mehta',
    specialty: 'Orthopedics',
    hospital: 'Metro Care Clinic',
    cityId: 'mumbai',
    area: 'Andheri East',
    rating: 4.8,
    reviewCount: 312,
    distanceKm: 3.4,
    yearsExperience: 14,
  },
  {
    id: 'c3',
    name: 'Dr. Neha Kulkarni',
    specialty: 'Neurology',
    hospital: 'Lilavati Hospital',
    cityId: 'mumbai',
    area: 'Bandra',
    rating: 4.95,
    reviewCount: 267,
    distanceKm: 2.1,
    yearsExperience: 22,
  },
  {
    id: 'c4',
    name: 'Dr. Priya Patel',
    specialty: 'Internal Medicine',
    hospital: 'HealthFirst Medical',
    cityId: 'delhi',
    area: 'Vasant Kunj',
    rating: 4.85,
    reviewCount: 501,
    distanceKm: 4.0,
    yearsExperience: 16,
  },
  {
    id: 'c5',
    name: 'Dr. Arjun Singh',
    specialty: 'Pediatrics',
    hospital: 'Apollo Children’s Wing',
    cityId: 'delhi',
    area: 'Dwarka',
    rating: 4.9,
    reviewCount: 389,
    distanceKm: 2.8,
    yearsExperience: 12,
  },
  {
    id: 'c6',
    name: 'Dr. Meera Joshi',
    specialty: 'Gastroenterology',
    hospital: 'Max Super Specialty',
    cityId: 'delhi',
    area: 'Saket',
    rating: 4.75,
    reviewCount: 198,
    distanceKm: 5.2,
    yearsExperience: 20,
  },
  {
    id: 'c7',
    name: 'Dr. Ananya Rao',
    specialty: 'Dermatology',
    hospital: 'Skin & Wellness Institute',
    cityId: 'bengaluru',
    area: 'Koramangala',
    rating: 4.88,
    reviewCount: 612,
    distanceKm: 1.5,
    yearsExperience: 11,
  },
  {
    id: 'c8',
    name: 'Dr. James Miller',
    specialty: 'Radiology',
    hospital: 'RadiologyOne Clinic',
    cityId: 'bengaluru',
    area: 'Indiranagar',
    rating: 4.7,
    reviewCount: 144,
    distanceKm: 3.9,
    yearsExperience: 15,
  },
  {
    id: 'c9',
    name: 'Dr. Sanjay Nair',
    specialty: 'Oncology',
    hospital: 'HCG Cancer Centre',
    cityId: 'bengaluru',
    area: 'Electronic City',
    rating: 4.92,
    reviewCount: 223,
    distanceKm: 6.1,
    yearsExperience: 19,
  },
  {
    id: 'c10',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Gynecology',
    hospital: 'Sunrise Women’s Hospital',
    cityId: 'hyderabad',
    area: 'Banjara Hills',
    rating: 4.86,
    reviewCount: 445,
    distanceKm: 2.3,
    yearsExperience: 17,
  },
  {
    id: 'c11',
    name: 'Dr. Ramesh Iyer',
    specialty: 'ENT',
    hospital: 'City Care Hospital',
    cityId: 'hyderabad',
    area: 'Gachibowli',
    rating: 4.72,
    reviewCount: 176,
    distanceKm: 4.7,
    yearsExperience: 13,
  },
  {
    id: 'c12',
    name: 'Dr. Lakshmi Narayanan',
    specialty: 'General Physician',
    hospital: 'Chennai Medical Centre',
    cityId: 'chennai',
    area: 'Adyar',
    rating: 4.83,
    reviewCount: 534,
    distanceKm: 1.8,
    yearsExperience: 21,
  },
  {
    id: 'c13',
    name: 'Dr. Fatima Khan',
    specialty: 'Endocrinology',
    hospital: 'Diabetes & Hormone Clinic',
    cityId: 'chennai',
    area: 'Velachery',
    rating: 4.91,
    reviewCount: 291,
    distanceKm: 3.2,
    yearsExperience: 14,
  },
  {
    id: 'c14',
    name: 'Dr. Karthik Subramaniam',
    specialty: 'Pulmonology',
    hospital: 'Global Health Chennai',
    cityId: 'chennai',
    area: 'OMR',
    rating: 4.78,
    reviewCount: 167,
    distanceKm: 5.5,
    yearsExperience: 16,
  },
];

function primaryCityForState(stateId: string) {
  return LOCATION_OPTIONS.find((l) => l.stateId === stateId);
}

function buildGeneratedConsultantsForStates(): Consultant[] {
  const first = ['Asha', 'Rohit', 'Deepa', 'Vikram', 'Meera', 'Sanjay', 'Kavita', 'Anil', 'Fatima', 'Daniel', 'Nisha', 'Arun'];
  const last = ['Menon', 'Kapoor', 'Das', 'Iyer', 'Verma', 'Sharma', 'Joseph', 'Patel', 'Reddy', 'Ghosh', 'Bose', 'Nair'];
  const spec = ['General Physician', 'Orthopedics', 'Gynecology', 'Cardiology', 'Neurology', 'Gastroenterology'];
  const out: Consultant[] = [];
  let i = 0;
  for (const s of INDIAN_STATES_UT) {
    const loc = primaryCityForState(s.id);
    if (!loc) continue;
    if (TOP_CONSULTANTS_SEED.some((c) => stateIdForCityId(c.cityId) === s.id)) continue;
    const cityName = loc.label.split(',')[0].trim();
    for (let j = 1; j <= 2; j++) {
      const k = i * 2 + j;
      out.push({
        id: `c-gen-${s.id}-${j}`,
        name: `Dr. ${first[k % first.length]} ${last[(k + 5) % last.length]}`,
        specialty: spec[k % spec.length],
        hospital: `${cityName} Specialty Hospital`,
        cityId: loc.id,
        area: j === 1 ? 'Central' : 'Medical corridor',
        rating: Math.round((4.45 + (k % 6) * 0.08) * 100) / 100,
        reviewCount: 110 + ((k * 37) % 520),
        distanceKm: Math.round((1.1 + (k % 8) * 0.65) * 10) / 10,
        yearsExperience: 9 + (k % 14),
      });
    }
    i++;
  }
  return out;
}

export const TOP_CONSULTANTS: Consultant[] = [
  ...TOP_CONSULTANTS_SEED,
  ...buildGeneratedConsultantsForStates(),
];

export function getConsultantsNearCity(cityId: string, limit = 6): Consultant[] {
  return TOP_CONSULTANTS.filter((c) => c.cityId === cityId)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit);
}

export function getConsultantsNearState(stateId: string, limit = 6): Consultant[] {
  return TOP_CONSULTANTS.filter((c) => stateIdForCityId(c.cityId) === stateId)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, limit);
}
