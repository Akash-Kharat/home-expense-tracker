import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  BarChart3,
  Users,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Home,
  ChevronRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';

const features = [
  { icon: Users, title: 'Multi-Family', desc: 'Manage expenses across your entire household with per-member tracking.' },
  { icon: Wallet, title: 'Smart Budgets', desc: 'Set category-wise monthly budgets and track spending in real-time.' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Visualize trends, compare members, and understand your spending.' },
  { icon: Shield, title: 'Settlements', desc: 'Auto-calculate who owes whom and settle debts with one click.' },
  { icon: Lock, title: 'Month Locking', desc: 'Lock finalized months to prevent edits and maintain data integrity.' },
  { icon: Mail, title: 'Invite System', desc: 'Invite family members via email with role-based access control.' },
];

const steps = [
  { num: '01', title: 'Create Family', desc: 'Sign up and create your family workspace in seconds.' },
  { num: '02', title: 'Add & Track', desc: 'Add members, set budgets, and log expenses as they happen.' },
  { num: '03', title: 'Settle & Analyze', desc: 'Generate settlements and dive into analytics monthly.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Hero */}
      <div className="relative">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-60 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          {/* Nav */}
          <nav className="flex items-center justify-between px-6 lg:px-20 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HomeExpense</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Now in Beta — Free for all families
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold leading-tight"
            >
              <span className="text-white">Take Control of Your</span>{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Family Finances
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto"
            >
              Track expenses, manage budgets, auto-settle debts, and gain deep insights into your household spending — all in one beautiful platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button size="lg">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" size="lg">
                  Learn More <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="px-6 lg:px-20 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl lg:text-4xl font-bold text-white">
              Everything You Need
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-slate-400">
              Powerful features to manage your household finances effortlessly.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                variants={fadeUp}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-indigo-500/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 lg:px-20 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl lg:text-4xl font-bold text-white">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-slate-400">
              Get started in three simple steps.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-12 lg:p-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Join families already managing their finances smarter. It&apos;s free to get started.
          </p>
          <Link to="/register">
            <Button size="lg">
              Start Your Free Account <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-20 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">HomeExpense</span>
          </div>
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} HomeExpense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
