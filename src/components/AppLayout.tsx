import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { Bell, Search, Bot, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-background overflow-x-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-strong">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 min-h-16 py-2 px-4 sm:px-6 lg:px-8">
            <div className="pl-12 lg:pl-0 min-w-0 flex-1 basis-[min(100%,14rem)] sm:basis-auto">
              <h2 className="text-base sm:text-lg font-bold text-foreground truncate">{title}</h2>
              {subtitle && <p className="text-xs text-muted-foreground line-clamp-2 sm:truncate">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
              <div className="hidden sm:flex items-center gap-2 max-w-full min-w-0">
                <button
                  onClick={() => navigate('/assistant')}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] sm:text-xs font-semibold shadow-glow hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  <Bot className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">AI Assistant</span>
                  <span className="md:hidden">AI</span>
                </button>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-secondary/60 border border-border/50 min-w-0 max-w-[11rem] md:max-w-none md:w-48">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0 flex-1 w-full"
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/assistant')}
                className="sm:hidden w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-glow shrink-0"
                aria-label="Open AI Assistant"
              >
                <Bot className="w-5 h-5" />
              </button>
              <button className="relative w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors shrink-0">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-health-red animate-pulse-soft" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-8 min-w-0 pb-8">
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>

          {showBack && (
            <div className="mt-10 pt-6 border-t border-border/50 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
              >
                <ArrowLeft className="w-4 h-4 text-primary" />
                Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
