import { 
  LayoutDashboard, FileText, Clock, Share2, Shield, Settings, 
  Moon, Sun, Heart, Menu, X, LogOut, LogIn, Bot, CalendarCheck
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/records', icon: FileText, label: 'Records' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/appointments', icon: CalendarCheck, label: 'Book Appointment' },
  { to: '/share', icon: Share2, label: 'Share' },
  { to: '/assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/security', icon: Shield, label: 'Security' },
];

export function AppSidebar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = isGuest ? 'G' : user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const SidebarContent = () => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 flex items-center gap-2.5 sm:gap-3 p-4 sm:p-5 lg:p-6 pr-12 lg:pr-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow shrink-0">
          <Heart className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">MedVault</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Health Records</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 basis-0 overflow-y-auto overscroll-contain px-2.5 sm:px-3 pt-1 pb-3">
        <div className="rounded-xl border border-border/80 bg-secondary/35 dark:bg-secondary/25 p-1.5 sm:p-2 space-y-0.5 sm:space-y-1 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[13px] sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="shrink-0 space-y-1 border-t border-border/80 bg-card/80 px-2.5 sm:px-3 pt-4 sm:pt-5 pb-2 sm:pb-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 w-full"
        >
          {theme === 'light' ? <Moon className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" /> : <Sun className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />}
          <span className="truncate">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`
          }
        >
          <Settings className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />
          <span>Settings</span>
        </NavLink>
        {isGuest ? (
          <button
            type="button"
            onClick={() => { setMobileOpen(false); navigate('/login'); }}
            className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200 w-full"
          >
            <LogIn className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />
            <span className="truncate text-left">Sign In / Sign Up</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      <div className="shrink-0 px-2.5 sm:px-3 pt-3 sm:pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="rounded-xl bg-secondary/50 border border-border/60 p-3 sm:p-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex shrink-0 items-center justify-center text-xs sm:text-sm font-bold ${isGuest ? 'bg-muted text-muted-foreground' : 'gradient-accent text-accent-foreground'}`}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                {isGuest ? 'Browsing as guest' : user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center shadow-card"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-dvh max-h-dvh w-[min(280px,calc(100vw-12px))] flex-col overflow-hidden border-r border-border bg-card lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 z-[1] flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary sm:right-4 sm:top-4"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-1">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:z-[45] h-dvh max-h-dvh w-[280px] flex-col overflow-hidden rounded-r-2xl border-r border-border/80 bg-card shadow-[6px_0_28px_-8px_rgba(0,0,0,0.12)] dark:shadow-[6px_0_32px_-6px_rgba(0,0,0,0.45)]"
        aria-label="Main navigation"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
