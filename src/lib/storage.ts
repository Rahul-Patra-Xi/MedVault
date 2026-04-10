/**
 * LocalStorage utility functions with safe error handling
 */

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('LocalStorage remove failed:', e);
  }
}

export function storageClear(): void {
  try {
    localStorage.clear();
  } catch (e) {
    console.warn('LocalStorage clear failed:', e);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// Storage keys
export const KEYS = {
  USER: 'medvault_user',
  RECORDS: 'medvault_records',
  MEDICATIONS: 'medvault_medications',
  SHARED_LINKS: 'medvault_shared_links',
  AUDIT_LOG: 'medvault_audit_log',
  APPOINTMENTS: 'medvault_appointments',
  THEME: 'theme',
} as const;
