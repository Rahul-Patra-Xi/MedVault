import {
  applyPatches,
  loadAppSettings,
  persistAppSettings,
  type AppSettingsState,
  type AppTheme,
  type NotificationKey,
  type SecurityKey,
} from '@/lib/app-settings';
import { parseAssistantSettingsMessage } from '@/lib/assistant-settings-parser';
import { normalizeStateId } from '@/lib/indian-locations';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface AppSettingsContextValue {
  settings: AppSettingsState;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setNotification: (key: NotificationKey, value: boolean) => void;
  toggleNotification: (key: NotificationKey) => void;
  setSecurity: (key: SecurityKey, value: boolean) => void;
  toggleSecurity: (key: SecurityKey) => void;
  setConsultantsStateId: (id: string) => void;
  applyAssistantMessage: (message: string) => string | null;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettingsState>(loadAppSettings);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  const replaceSettings = useCallback((next: AppSettingsState) => {
    persistAppSettings(next);
    setSettings(next);
  }, []);

  const updateSettings = useCallback((fn: (prev: AppSettingsState) => AppSettingsState) => {
    setSettings(prev => {
      const next = fn(prev);
      persistAppSettings(next);
      return next;
    });
  }, []);

  const setTheme = useCallback(
    (theme: AppTheme) => {
      updateSettings(prev => ({ ...prev, theme }));
    },
    [updateSettings],
  );

  const toggleTheme = useCallback(() => {
    updateSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, [updateSettings]);

  const setNotification = useCallback(
    (key: NotificationKey, value: boolean) => {
      updateSettings(prev => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: value },
      }));
    },
    [updateSettings],
  );

  const toggleNotification = useCallback(
    (key: NotificationKey) => {
      updateSettings(prev => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
      }));
    },
    [updateSettings],
  );

  const setSecurity = useCallback(
    (key: SecurityKey, value: boolean) => {
      updateSettings(prev => ({
        ...prev,
        security: { ...prev.security, [key]: value },
      }));
    },
    [updateSettings],
  );

  const toggleSecurity = useCallback(
    (key: SecurityKey) => {
      updateSettings(prev => ({
        ...prev,
        security: { ...prev.security, [key]: !prev.security[key] },
      }));
    },
    [updateSettings],
  );

  const setConsultantsStateId = useCallback(
    (id: string) => {
      const nextId = normalizeStateId(id);
      updateSettings(prev => ({ ...prev, consultantsStateId: nextId }));
    },
    [updateSettings],
  );

  const applyAssistantMessage = useCallback((message: string): string | null => {
    let reply: string | null = null;
    setSettings(prev => {
      const parsed = parseAssistantSettingsMessage(message, prev);
      if (!parsed) return prev;
      const next = applyPatches(prev, parsed.patch);
      if (
        next.theme === prev.theme &&
        next.consultantsStateId === prev.consultantsStateId &&
        JSON.stringify(next.notifications) === JSON.stringify(prev.notifications) &&
        JSON.stringify(next.security) === JSON.stringify(prev.security)
      ) {
        reply = 'Those preferences are already set that way.';
        return prev;
      }
      persistAppSettings(next);
      reply = `Updated your preferences:\n${parsed.summaries.map(s => `• ${s}`).join('\n')}`;
      return next;
    });
    return reply;
  }, []);

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      settings,
      theme: settings.theme,
      setTheme,
      toggleTheme,
      setNotification,
      toggleNotification,
      setSecurity,
      toggleSecurity,
      setConsultantsStateId,
      applyAssistantMessage,
    }),
    [
      settings,
      setTheme,
      toggleTheme,
      setNotification,
      toggleNotification,
      setSecurity,
      toggleSecurity,
      setConsultantsStateId,
      applyAssistantMessage,
    ],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useAppSettings();
  return { theme, toggleTheme, setTheme };
}
