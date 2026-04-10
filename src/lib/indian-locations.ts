/** States & UTs of India (alphabetical) — ids are stable URL-safe slugs. */
export const INDIAN_STATES_UT = [
  { id: 'andaman-nicobar', name: 'Andaman and Nicobar Islands' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh' },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh' },
  { id: 'assam', name: 'Assam' },
  { id: 'bihar', name: 'Bihar' },
  { id: 'chandigarh', name: 'Chandigarh' },
  { id: 'chhattisgarh', name: 'Chhattisgarh' },
  { id: 'dadra-daman-diu', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'goa', name: 'Goa' },
  { id: 'gujarat', name: 'Gujarat' },
  { id: 'haryana', name: 'Haryana' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh' },
  { id: 'jammu-kashmir', name: 'Jammu and Kashmir' },
  { id: 'jharkhand', name: 'Jharkhand' },
  { id: 'karnataka', name: 'Karnataka' },
  { id: 'kerala', name: 'Kerala' },
  { id: 'ladakh', name: 'Ladakh' },
  { id: 'lakshadweep', name: 'Lakshadweep' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh' },
  { id: 'maharashtra', name: 'Maharashtra' },
  { id: 'manipur', name: 'Manipur' },
  { id: 'meghalaya', name: 'Meghalaya' },
  { id: 'mizoram', name: 'Mizoram' },
  { id: 'nagaland', name: 'Nagaland' },
  { id: 'odisha', name: 'Odisha' },
  { id: 'puducherry', name: 'Puducherry' },
  { id: 'punjab', name: 'Punjab' },
  { id: 'rajasthan', name: 'Rajasthan' },
  { id: 'sikkim', name: 'Sikkim' },
  { id: 'tamil-nadu', name: 'Tamil Nadu' },
  { id: 'telangana', name: 'Telangana' },
  { id: 'tripura', name: 'Tripura' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
  { id: 'uttarakhand', name: 'Uttarakhand' },
  { id: 'west-bengal', name: 'West Bengal' },
] as const;

export type IndianStateId = (typeof INDIAN_STATES_UT)[number]['id'];

export interface LocationOption {
  id: string;
  /** Shown in dropdowns, e.g. "Mumbai, Maharashtra" */
  label: string;
  stateId: string;
}

/** One demo locality per state/UT; existing ids kept for doctor/consultant data. */
export const LOCATION_OPTIONS: LocationOption[] = [
  { id: 'port-blair', label: 'Port Blair, Andaman and Nicobar Islands', stateId: 'andaman-nicobar' },
  { id: 'visakhapatnam', label: 'Visakhapatnam, Andhra Pradesh', stateId: 'andhra-pradesh' },
  { id: 'itanagar', label: 'Itanagar, Arunachal Pradesh', stateId: 'arunachal-pradesh' },
  { id: 'guwahati', label: 'Guwahati, Assam', stateId: 'assam' },
  { id: 'patna', label: 'Patna, Bihar', stateId: 'bihar' },
  { id: 'chandigarh-city', label: 'Chandigarh', stateId: 'chandigarh' },
  { id: 'raipur', label: 'Raipur, Chhattisgarh', stateId: 'chhattisgarh' },
  { id: 'silvassa', label: 'Silvassa, Dadra and Nagar Haveli and Daman and Diu', stateId: 'dadra-daman-diu' },
  { id: 'delhi', label: 'Delhi NCR', stateId: 'delhi' },
  { id: 'panaji', label: 'Panaji, Goa', stateId: 'goa' },
  { id: 'ahmedabad', label: 'Ahmedabad, Gujarat', stateId: 'gujarat' },
  { id: 'gurugram', label: 'Gurugram, Haryana', stateId: 'haryana' },
  { id: 'shimla', label: 'Shimla, Himachal Pradesh', stateId: 'himachal-pradesh' },
  { id: 'srinagar', label: 'Srinagar, Jammu and Kashmir', stateId: 'jammu-kashmir' },
  { id: 'ranchi', label: 'Ranchi, Jharkhand', stateId: 'jharkhand' },
  { id: 'bengaluru', label: 'Bengaluru, Karnataka', stateId: 'karnataka' },
  { id: 'kochi', label: 'Kochi, Kerala', stateId: 'kerala' },
  { id: 'leh', label: 'Leh, Ladakh', stateId: 'ladakh' },
  { id: 'kavaratti', label: 'Kavaratti, Lakshadweep', stateId: 'lakshadweep' },
  { id: 'bhopal', label: 'Bhopal, Madhya Pradesh', stateId: 'madhya-pradesh' },
  { id: 'mumbai', label: 'Mumbai, Maharashtra', stateId: 'maharashtra' },
  { id: 'imphal', label: 'Imphal, Manipur', stateId: 'manipur' },
  { id: 'shillong', label: 'Shillong, Meghalaya', stateId: 'meghalaya' },
  { id: 'aizawl', label: 'Aizawl, Mizoram', stateId: 'mizoram' },
  { id: 'kohima', label: 'Kohima, Nagaland', stateId: 'nagaland' },
  { id: 'bhubaneswar', label: 'Bhubaneswar, Odisha', stateId: 'odisha' },
  { id: 'puducherry-town', label: 'Puducherry', stateId: 'puducherry' },
  { id: 'amritsar', label: 'Amritsar, Punjab', stateId: 'punjab' },
  { id: 'jaipur', label: 'Jaipur, Rajasthan', stateId: 'rajasthan' },
  { id: 'gangtok', label: 'Gangtok, Sikkim', stateId: 'sikkim' },
  { id: 'chennai', label: 'Chennai, Tamil Nadu', stateId: 'tamil-nadu' },
  { id: 'hyderabad', label: 'Hyderabad, Telangana', stateId: 'telangana' },
  { id: 'agartala', label: 'Agartala, Tripura', stateId: 'tripura' },
  { id: 'lucknow', label: 'Lucknow, Uttar Pradesh', stateId: 'uttar-pradesh' },
  { id: 'dehradun', label: 'Dehradun, Uttarakhand', stateId: 'uttarakhand' },
  { id: 'kolkata', label: 'Kolkata, West Bengal', stateId: 'west-bengal' },
];

export const DEFAULT_LOCATION_ID = 'mumbai';

/** Default region when filtering by state only. */
export const DEFAULT_STATE_ID = 'maharashtra';

const stateIds = new Set(INDIAN_STATES_UT.map((s) => s.id));

const byId = new Map(LOCATION_OPTIONS.map((l) => [l.id, l]));

export function getLocationById(id: string): LocationOption | undefined {
  return byId.get(id);
}

export function locationsForState(stateId: string): LocationOption[] {
  return LOCATION_OPTIONS.filter((l) => l.stateId === stateId);
}

export function stateIdForCityId(cityId: string): string | undefined {
  return getLocationById(cityId)?.stateId;
}

export function normalizeCityId(cityId: string): string {
  return getLocationById(cityId) ? cityId : DEFAULT_LOCATION_ID;
}

export function stateDisplayName(stateId: string): string {
  const s = INDIAN_STATES_UT.find((x) => x.id === stateId);
  return s?.name ?? stateId;
}

/** Accepts a state id, or legacy city id (migrated from older storage). */
export function normalizeStateId(value: string): string {
  if (stateIds.has(value)) return value;
  const fromCity = stateIdForCityId(normalizeCityId(value));
  if (fromCity && stateIds.has(fromCity)) return fromCity;
  return DEFAULT_STATE_ID;
}
