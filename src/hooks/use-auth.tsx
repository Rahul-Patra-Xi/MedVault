import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { storageGet, storageSet, storageRemove, generateId, KEYS } from '@/lib/storage';
import type { User } from '@/lib/types';

const GUEST_USER: User = { id: 'guest', name: 'Guest User', email: 'guest@medvault.app' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function isValidEmail(email: string): boolean {
  const t = email.trim();
  if (!t || t.length > 254) return false;
  return EMAIL_RE.test(t);
}

interface AuthContextType {
  user: User;
  isGuest: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: GUEST_USER,
  isGuest: true,
  login: () => ({ success: false }),
  signup: () => ({ success: false }),
  logout: () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => storageGet<User | null>(KEYS.USER, null) ?? GUEST_USER);

  const isGuest = user.id === 'guest';

  const login = useCallback((email: string, _password: string) => {
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!isValidEmail(email)) return { success: false, error: 'Please enter a valid email address' };
    const accounts = storageGet<Record<string, { name: string; password: string }>>(KEYS.ACCOUNTS, {});
    const account = accounts[email.toLowerCase()];
    if (!account) return { success: false, error: 'Account not found. Please sign up first.' };
    if (account.password !== _password) return { success: false, error: 'Invalid password' };
    const u: User = { id: generateId(), name: account.name, email: email.toLowerCase() };
    storageSet(KEYS.USER, u);
    setUser(u);
    return { success: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password) return { success: false, error: 'All fields are required' };
    if (!isValidEmail(email)) return { success: false, error: 'Please enter a valid email address' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
    const accounts = storageGet<Record<string, { name: string; password: string }>>(KEYS.ACCOUNTS, {});
    if (accounts[email.toLowerCase()]) return { success: false, error: 'Account already exists' };
    accounts[email.toLowerCase()] = { name: name.trim(), password };
    storageSet(KEYS.ACCOUNTS, accounts);
    const u: User = { id: generateId(), name, email: email.toLowerCase() };
    storageSet(KEYS.USER, u);
    setUser(u);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    storageRemove(KEYS.USER);
    setUser(GUEST_USER);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (prev.id === 'guest') return prev;
      const updated = { ...prev, ...data };
      storageSet(KEYS.USER, updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
