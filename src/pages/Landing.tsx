import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import {
  Stethoscope, Shield, Share2, FileText, Clock, Zap, Lock, Smartphone,
  ChevronRight, Moon, Sun, Star, ArrowRight, Brain
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

const features = [
  { icon: FileText, title: 'All Records, One Place', desc: 'Prescriptions, lab reports, imaging — organized and accessible anytime.' },
  { icon: Shield, title: 'Bank-Level Security', desc: 'End-to-end encryption with HIPAA-compliant practices for total privacy.' },
  { icon: Share2, title: 'Instant Sharing', desc: 'Share records with doctors via secure links or QR codes in seconds.' },
  { icon: Clock, title: 'Health Timeline', desc: 'Visualize your entire medical history on a beautiful interactive timeline.' },
  { icon: Brain, title: 'AI Health Insights', desc: 'Get smart summaries and alerts powered by AI analysis of your records.' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Designed for every device — access your health data on the go.' },
];

const steps = [
  { num: '01', title: 'Upload Records', desc: 'Drag & drop your medical documents — PDFs, images, reports.' },
  { num: '02', title: 'Organize & Tag', desc: 'Auto-categorize and tag records by type, date, and doctor.' },
  { num: '03', title: 'Share Securely', desc: 'Generate encrypted links with expiry for doctors and hospitals.' },
];

const testimonials = [
  { name: 'Dr. Sarah Chen', role: 'Cardiologist', text: 'MedVault transformed how I receive patient records. Instant, secure, and organized.', rating: 5 },
  { name: 'James Rivera', role: 'Patient', text: 'I finally have all my medical history in one place. The timeline view is incredible.', rating: 5 },
  { name: 'Dr. Aisha Patel', role: 'General Practitioner', text: 'The sharing feature saves me hours every week. My patients love the QR code access.', rating: 5 },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-strong"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Stethoscope className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">MedVault</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
              {theme === 'light' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
            </button>
            <button onClick={() => navigate('/login')} className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold shadow-glow hover:shadow-lg transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-28 lg:pt-32 lg:pb-40">
        <motion.div initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" /> AI-Powered Health Management
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Your Health Records,{' '}
            <span className="text-gradient">Unified & Secure</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Store, organize, and share your medical records with military-grade encryption. Access your complete health history anytime, anywhere.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-glow hover:shadow-lg transition-all text-base flex items-center justify-center gap-2"
            >
              Open Dashboard <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/records')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all text-base flex items-center justify-center gap-2 border border-border/50"
            >
              <FileText className="w-5 h-5" /> Upload Records
            </button>
          </motion.div>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { v: '256-bit', l: 'Encryption' },
            { v: '99.9%', l: 'Uptime' },
            { v: '50K+', l: 'Users Trust Us' },
            { v: '<1s', l: 'Share Speed' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 rounded-2xl glass">
              <p className="text-2xl font-bold text-foreground">{s.v}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Features</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need for your health data</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">How it works</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold tracking-tight">Three simple steps</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="relative p-8 rounded-2xl bg-card border border-border/50 text-center"
            >
              <span className="text-5xl font-black text-primary/10">{s.num}</span>
              <h3 className="text-xl font-bold mt-4 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Testimonials</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold tracking-tight">Loved by patients & doctors</motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="p-6 rounded-2xl bg-card border border-border/50 shadow-card"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-health-orange text-health-orange" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="rounded-3xl gradient-hero p-12 md:p-16 text-center text-primary-foreground shadow-glow"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to take control of your health?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Join thousands who trust MedVault to keep their medical records safe, organized, and always accessible.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3.5 rounded-2xl bg-card/20 hover:bg-card/30 backdrop-blur-sm text-primary-foreground font-semibold text-base transition-all inline-flex items-center gap-2"
          >
            Start for Free <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">MedVault</span>
              </div>
              <p className="text-sm text-muted-foreground">Secure health record management for everyone.</p>
            </div>
            {[
              { h: 'Product', links: ['Features', 'Security', 'Pricing', 'API'] },
              { h: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { h: 'Legal', links: ['Privacy', 'Terms', 'HIPAA', 'Compliance'] },
            ].map(col => (
              <div key={col.h}>
                <h4 className="text-sm font-semibold mb-3">{col.h}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 MedVault. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-health-green" />
              <span className="text-xs text-muted-foreground">256-bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
