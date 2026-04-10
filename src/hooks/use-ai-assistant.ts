import { useCallback, useMemo, useState } from 'react';
import { storageGet, storageSet } from '@/lib/storage';
import type { MedicalRecord, Medication, SharedLink } from '@/lib/types';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'medvault_ai_assistant_chat';

const DEFAULT_MESSAGES: AssistantMessage[] = [
  {
    id: 'ai-hello',
    role: 'assistant',
    content: 'Hi! I am your AI Health Assistant. Ask me for medication reminders, upcoming share expiries, or a quick summary of your records.',
    createdAt: new Date().toISOString(),
  },
];

function loadMessages(): AssistantMessage[] {
  const stored = storageGet<AssistantMessage[] | null>(STORAGE_KEY, null);
  if (stored === null) {
    storageSet(STORAGE_KEY, DEFAULT_MESSAGES);
    return DEFAULT_MESSAGES;
  }
  return stored;
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildInsight(records: MedicalRecord[], medications: Medication[], sharedLinks: SharedLink[], question: string): string {
  const q = question.toLowerCase();
  const activeMeds = medications.filter(m => m.active);
  const activeShares = sharedLinks.filter(s => s.isActive);
  const latestRecord = records[0];

  if (q.includes('medication') || q.includes('medicine') || q.includes('dose')) {
    if (activeMeds.length === 0) return 'You currently have no active medications in your vault.';
    const medList = activeMeds.slice(0, 3).map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ');
    return `You have ${activeMeds.length} active medications. Top entries: ${medList}. Tip: set fixed morning/evening reminders for better adherence.`;
  }
  if (q.includes('share') || q.includes('doctor') || q.includes('link')) {
    if (activeShares.length === 0) return 'No active share links right now. You can create one from the Share page when needed.';
    const first = activeShares[0];
    return `You have ${activeShares.length} active share link(s). The nearest expiry appears for ${first.recipientName ?? 'a recipient'} on ${new Date(first.expiresAt).toLocaleDateString()}.`;
  }
  if (q.includes('summary') || q.includes('record') || q.includes('health')) {
    if (!latestRecord) return 'No records found yet. Upload your first record and I can summarize trends.';
    return `You currently have ${records.length} records. Latest: "${latestRecord.title}" from ${latestRecord.hospital} on ${new Date(latestRecord.date).toLocaleDateString()}.`;
  }
  return 'I can help with medication status, record summaries, and secure sharing insights. Try: "Give me today’s medication plan".';
}

export function useAiAssistant(records: MedicalRecord[], medications: Medication[], sharedLinks: SharedLink[]) {
  const [messages, setMessages] = useState<AssistantMessage[]>(loadMessages);
  const [isThinking, setIsThinking] = useState(false);

  const persist = useCallback((next: AssistantMessage[]) => {
    setMessages(next);
    storageSet(STORAGE_KEY, next);
  }, []);

  const sendMessage = useCallback((text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;

    const userMessage: AssistantMessage = {
      id: generateId(),
      role: 'user',
      content: cleaned,
      createdAt: new Date().toISOString(),
    };

    const withUser = [...messages, userMessage];
    persist(withUser);
    setIsThinking(true);

    window.setTimeout(() => {
      const assistantMessage: AssistantMessage = {
        id: generateId(),
        role: 'assistant',
        content: buildInsight(records, medications, sharedLinks, cleaned),
        createdAt: new Date().toISOString(),
      };
      persist([...withUser, assistantMessage]);
      setIsThinking(false);
    }, 700);
  }, [medications, messages, persist, records, sharedLinks]);

  const quickPrompts = useMemo(
    () => [
      'Give me today’s medication plan',
      'Any share links expiring soon?',
      'Summarize my latest health records',
    ],
    []
  );

  const clearChat = useCallback(() => {
    persist(DEFAULT_MESSAGES);
  }, [persist]);

  return { messages, sendMessage, clearChat, quickPrompts, isThinking };
}
