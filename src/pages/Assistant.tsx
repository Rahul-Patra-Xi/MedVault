import { AppLayout } from '@/components/AppLayout';
import { useAiAssistant } from '@/hooks/use-ai-assistant';
import { useMedications } from '@/hooks/use-medications';
import { useRecords } from '@/hooks/use-records';
import { useSharing } from '@/hooks/use-sharing';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const Assistant = () => {
  const { records } = useRecords();
  const { medications } = useMedications();
  const { sharedLinks } = useSharing();
  const { messages, sendMessage, quickPrompts, clearChat, isThinking } = useAiAssistant(records, medications, sharedLinks);
  const [input, setInput] = useState('');

  const metrics = useMemo(() => {
    const activeMeds = medications.filter(m => m.active).length;
    const activeShares = sharedLinks.filter(s => s.isActive).length;
    return { activeMeds, activeShares, records: records.length };
  }, [medications, records.length, sharedLinks]);

  const onSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <AppLayout title="AI Health Assistant" subtitle="Personalized health insights using your records and activity">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-5">
        <div className="xl:col-span-3 rounded-2xl border border-border/50 bg-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-start sm:items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-foreground">MedVault Copilot</h3>
                <p className="text-xs text-muted-foreground break-words">Demo AI assistant for medication, records, and sharing guidance.</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm text-secondary-foreground flex items-center justify-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>

          <div className="h-[min(430px,55vh)] sm:h-[430px] min-h-[220px] overflow-y-auto rounded-xl border border-border/50 bg-background/50 p-3 sm:p-4 space-y-3">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'assistant'
                    ? 'bg-primary/10 text-foreground border border-primary/20'
                    : 'bg-secondary text-secondary-foreground ml-auto'
                }`}
              >
                {msg.content}
              </motion.div>
            ))}
            {isThinking && (
              <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
                <span className="text-foreground">Analyzing your health timeline...</span>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSend();
                }}
                className="flex-1 min-w-0 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Ask about medications, records, or sharing activity..."
              />
              <button onClick={onSend} className="px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shrink-0">
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Records in vault</p>
            <p className="text-2xl font-bold text-foreground">{metrics.records}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Active medications</p>
            <p className="text-2xl font-bold text-foreground">{metrics.activeMeds}</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Active share links</p>
            <p className="text-2xl font-bold text-foreground">{metrics.activeShares}</p>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Disclaimer</p>
            <p className="text-xs text-muted-foreground">
              This assistant is informational only and not a replacement for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Assistant;
