import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Stethoscope, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { KEYS, storageGet } from '@/lib/storage';

const Login = () => {
  const { isGuest, login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const hasRegisteredAccount =
    Object.keys(storageGet<Record<string, unknown>>(KEYS.ACCOUNTS, {})).length > 0;

  useEffect(() => {
    if (!hasRegisteredAccount) setIsSignup(true);
  }, [hasRegisteredAccount]);

  if (!isGuest) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = isSignup ? signup(name, email, password) : login(email, password);
    if (!result.success) setError(result.error || 'Something went wrong');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">MedVault</h1>
          <p className="text-muted-foreground mt-1">Your secure health records platform</p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity">
              {isSignup ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-sm text-muted-foreground text-center mt-6 space-y-1">
            {hasRegisteredAccount ? (
              <p>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignup(!isSignup); setError(''); }}
                  className="text-primary font-semibold hover:underline"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed px-1">
                Sign in becomes available after you create an account with a valid email.
              </p>
            )}
          </div>
        </div>

        <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue as Guest
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Sign up to save your data permanently. Guest data is stored locally.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
