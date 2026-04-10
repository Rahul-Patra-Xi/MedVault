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
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">MedVault</h1>
          <p className="text-xs text-muted-foreground">Health Records</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 space-y-1 border-t border-border">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 w-full"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
        {isGuest ? (
          <button
            onClick={() => { setMobileOpen(false); navigate('/login'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-200 w-full"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In / Sign Up</span>
          </button>
        ) : (
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      <div className="p-4 mx-3 mb-3 rounded-xl bg-secondary/50">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isGuest ? 'bg-muted text-muted-foreground' : 'gradient-accent text-accent-foreground'}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {isGuest ? 'Browsing as guest' : user.email}
            </p>
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
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block w-[280px] min-h-screen bg-card border-r border-border flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
