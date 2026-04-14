import type { AppSettingsPatch, AppSettingsState, AppTheme, NotificationKey, SecurityKey } from '@/lib/app-settings';
import { INDIAN_STATES_UT } from '@/lib/indian-locations';

export interface ParsedAssistantSettings {
  patch: AppSettingsPatch;
  /** Human-readable lines for the assistant reply */
  summaries: string[];
}

function parseOnOff(q: string): boolean | null {
  if (/\b(enable|turn on|switch on|activate|show)\b/.test(q)) return true;
  if (/\b(disable|turn off|switch off|deactivate|hide)\b/.test(q)) return false;
  return null;
}

function resolveStateIdFromText(q: string): string | null {
  const compact = q.replace(/[\s_]+/g, '');
  for (const s of INDIAN_STATES_UT) {
    const slug = s.id.replace(/-/g, '');
    if (compact.includes(slug)) return s.id;
  }
  for (const s of INDIAN_STATES_UT) {
    const n = s.name.toLowerCase();
    if (q.includes(n)) return s.id;
  }
  return null;
}

/**
 * Detects natural-language app setting changes for the AI assistant.
 * Returns null when the message should be handled as a normal health Q&A.
 */
export function parseAssistantSettingsMessage(
  raw: string,
  current: AppSettingsState,
): ParsedAssistantSettings | null {
  const q = raw.trim().toLowerCase();
  if (!q) return null;

  const patch: AppSettingsPatch = {};
  const summaries: string[] = [];

  const onOff = parseOnOff(q);

  // Theme
  if (/\btoggle theme\b/.test(q) || /\bswitch theme\b/.test(q)) {
    patch.theme = current.theme === 'dark' ? 'light' : 'dark';
    summaries.push(`Theme toggled to ${patch.theme} mode.`);
  } else if (/\bdark mode\b/.test(q) || /\bswitch to dark\b/.test(q) || /\buse dark\b/.test(q)) {
    patch.theme = 'dark';
    summaries.push('Theme set to dark mode.');
  } else if (/\blight mode\b/.test(q) || /\bswitch to light\b/.test(q) || /\buse light\b/.test(q)) {
    patch.theme = 'light';
    summaries.push('Theme set to light mode.');
  }

  const notifMatchers: { keys: NotificationKey[]; re: RegExp }[] = [
    {
      keys: ['medicationReminders', 'appointmentReminders', 'recordSharingAlerts', 'securityAlerts'],
      re: /\b(all|every)\s+notifications?\b/,
    },
    {
      keys: ['medicationReminders'],
      re: /\b(medication|medicine|pill)\s+reminders?\b|\bremind(?:er)?s?\s+for\s+meds?\b/,
    },
    {
      keys: ['appointmentReminders'],
      re: /\bappointment\s+reminders?\b|\bclinic\s+reminders?\b/,
    },
    {
      keys: ['recordSharingAlerts'],
      re: /\brecord\s+sharing\s+alerts?\b|\bsharing\s+alerts?\b|\bshare\s+alerts?\b/,
    },
    {
      keys: ['securityAlerts'],
      re: /\bsecurity\s+alerts?\b/,
    },
  ];

  for (const { keys, re } of notifMatchers) {
    if (!re.test(q)) continue;
    const v = onOff ?? (/\boff\b|\bdisable\b/.test(q) ? false : /\bon\b|\benable\b/.test(q) ? true : null);
    if (v === null) continue;
    patch.notifications = { ...patch.notifications };
    for (const k of keys) {
      patch.notifications[k] = v;
    }
    if (keys.length > 1) {
      summaries.push(`All notification types ${v ? 'enabled' : 'disabled'}.`);
    } else {
      summaries.push(`${labelNotification(keys[0]!)} ${v ? 'enabled' : 'disabled'}.`);
    }
    break;
  }

  const secMatchers: { key: SecurityKey; re: RegExp; label: string }[] = [
    { key: 'tfa', re: /\b(2fa|two[-\s]?factor|tfa)\b/, label: 'Two-factor authentication' },
    { key: 'bio', re: /\b(biometric|fingerprint|face\s?id)\b/, label: 'Biometric login' },
    { key: 'e2e', re: /\b(e2e|end[-\s]?to[-\s]?end\s+encryption|encryption)\b/, label: 'End-to-end encryption' },
    { key: 'log', re: /\b(access\s+)?logging\b|\baccess\s+log\b|\baudit\s+log\b/, label: 'Access logging' },
  ];

  for (const { key, re, label } of secMatchers) {
    if (!re.test(q)) continue;
    const v = onOff ?? (/\boff\b|\bdisable\b/.test(q) ? false : /\bon\b|\benable\b/.test(q) ? true : null);
    if (v === null) continue;
    patch.security = { ...patch.security, [key]: v };
    summaries.push(`${label} ${v ? 'enabled' : 'disabled'}.`);
  }

  // Consultant / dashboard area
  if (
    /\b(set|change|update)\b/.test(q) &&
    (/\b(state|area|location|region|consultants?)\b/.test(q) || /\bnearby\b/.test(q))
  ) {
    const id = resolveStateIdFromText(q);
    if (id) {
      patch.consultantsStateId = id;
      const name = INDIAN_STATES_UT.find(s => s.id === id)?.name ?? id;
      summaries.push(`Nearby consultants area set to ${name}.`);
    }
  }

  if (Object.keys(patch).length === 0) return null;

  return { patch, summaries: dedupeSummaries(summaries) };
}

function labelNotification(k: NotificationKey): string {
  switch (k) {
    case 'medicationReminders':
      return 'Medication reminders';
    case 'appointmentReminders':
      return 'Appointment reminders';
    case 'recordSharingAlerts':
      return 'Record sharing alerts';
    case 'securityAlerts':
      return 'Security alerts';
    default:
      return k;
  }
}

function dedupeSummaries(lines: string[]): string[] {
  return [...new Set(lines)];
}
