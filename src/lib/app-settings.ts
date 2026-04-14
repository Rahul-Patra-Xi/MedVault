import { DEFAULT_STATE_ID, normalizeStateId } from '@/lib/indian-locations';
import { KEYS, storageGet, storageSet } from '@/lib/storage';

export type AppTheme = 'light' | 'dark';

export type NotificationKey =
  | 'medicationReminders'
  | 'appointmentReminders'
  | 'recordSharingAlerts'
  | 'securityAlerts';

export type SecurityKey = 'tfa' | 'bio' | 'e2e' | 'log';

export interface AppSettingsState {
  theme: AppTheme;
  notifications: Record<NotificationKey, boolean>;
  security: Record<SecurityKey, boolean>;
  consultantsStateId: string;
}

export const DEFAULT_APP_SETTINGS: AppSettingsState = {
  theme: 'light',
  notifications: {
    medicationReminders: true,
    appointmentReminders: true,
    recordSharingAlerts: true,
    securityAlerts: true,
  },
  security: {
    tfa: true,
    bio: false,
    e2e: true,
    log: true,
  },
  consultantsStateId: DEFAULT_STATE_ID,
};

function mergeSettings(partial: Partial<AppSettingsState> | null | undefined): AppSettingsState {
  if (!partial || typeof partial !== 'object') return { ...DEFAULT_APP_SETTINGS };
  return {
    ...DEFAULT_APP_SETTINGS,
    ...partial,
    notifications: { ...DEFAULT_APP_SETTINGS.notifications, ...(partial.notifications ?? {}) },
    security: { ...DEFAULT_APP_SETTINGS.security, ...(partial.security ?? {}) },
    consultantsStateId: normalizeStateId(partial.consultantsStateId ?? DEFAULT_APP_SETTINGS.consultantsStateId),
  };
}

export function loadAppSettings(): AppSettingsState {
  const stored = storageGet<Partial<AppSettingsState> | null>(KEYS.APP_SETTINGS, null);
  if (stored && (stored.theme === 'light' || stored.theme === 'dark')) {
    return mergeSettings(stored);
  }

  let theme: AppTheme = DEFAULT_APP_SETTINGS.theme;
  try {
    const t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') theme = t;
  } catch {
    /* ignore */
  }

  const consultantsStateId = normalizeStateId(
    storageGet<string>(KEYS.CONSULTANTS_NEARBY_CITY, DEFAULT_STATE_ID),
  );

  return mergeSettings({ theme, consultantsStateId });
}

export function persistAppSettings(state: AppSettingsState): void {
  storageSet(KEYS.APP_SETTINGS, state);
  try {
    localStorage.setItem('theme', state.theme);
  } catch {
    /* ignore */
  }
  storageSet(KEYS.CONSULTANTS_NEARBY_CITY, normalizeStateId(state.consultantsStateId));
}

export type AppSettingsPatch = {
  theme?: AppTheme;
  notifications?: Partial<Record<NotificationKey, boolean>>;
  security?: Partial<Record<SecurityKey, boolean>>;
  consultantsStateId?: string;
};

export function applyPatches(base: AppSettingsState, patch: AppSettingsPatch): AppSettingsState {
  const next: AppSettingsState = {
    ...base,
    notifications: { ...base.notifications, ...patch.notifications },
    security: { ...base.security, ...patch.security },
  };
  if (patch.theme) next.theme = patch.theme;
  if (patch.consultantsStateId !== undefined) {
    next.consultantsStateId = normalizeStateId(patch.consultantsStateId);
  }
  return next;
}
