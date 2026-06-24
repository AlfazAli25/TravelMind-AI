import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSparkles,
  HiOutlineUpload,
  HiOutlineDocumentSearch,
  HiOutlineMap,
  HiOutlineChatAlt2,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineUpload,
    title: 'Smart Upload',
    desc: 'Upload flight tickets, hotel bookings, and travel confirmations in any format — PDF, images, or scans.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HiOutlineDocumentSearch,
    title: 'AI Extraction',
    desc: 'Our AI reads your documents and extracts all booking details automatically — flights, hotels, trains, and more.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: HiOutlineMap,
    title: 'Smart Itineraries',
    desc: 'Get day-by-day itineraries with activities, food recommendations, budget estimates, and local tips.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: HiOutlineChatAlt2,
    title: 'AI Travel Assistant',
    desc: 'Ask anything about your trip — packing tips, restaurant recommendations, local customs, and more.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Share Anywhere',
    desc: 'Share your itinerary with travel companions via a beautiful public link. No account required to view.',
    color: 'from-primary-500 to-accent-500',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'PDF Export',
    desc: 'Export professional PDF itineraries with complete trip details, daily schedules, and booking info.',
    color: 'from-rose-500 to-red-500',
  },
];

const steps = [
  { num: '01', title: 'Upload Documents', desc: 'Drag and drop your travel tickets, bookings, and confirmations.', emoji: '📄' },
  { num: '02', title: 'AI Extracts Data', desc: 'Our AI reads and understands your travel documents automatically.', emoji: '🤖' },
  { num: '03', title: 'Review & Edit', desc: 'Review extracted information and make any corrections needed.', emoji: '✏️' },
  { num: '04', title: 'Get Your Itinerary', desc: 'Receive a beautiful, day-by-day travel plan with recommendations.', emoji: '🗺️' },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Frequent Traveler', text: 'TravelMind AI turned my messy pile of booking confirmations into a beautiful trip plan in seconds. Absolutely magical!', avatar: '👩‍💼' },
  { name: 'James L.', role: 'Digital Nomad', text: 'The AI assistant knew exactly what to pack for my Southeast Asia trip. Like having a personal travel agent in my pocket.', avatar: '👨‍💻' },
  { name: 'Priya M.', role: 'Family Traveler', text: 'Planning family trips used to take hours. Now I just upload our tickets and get a complete itinerary with kid-friendly activities!', avatar: '👩‍👧' },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* BG Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[150px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-600/15 rounded-full blur-[130px]" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-900/20 to-transparent rounded-full" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium">
                <HiOutlineLightningBolt className="w-4 h-4" />
                Powered by Google Gemini AI
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
              Your Travel Plans,{' '}
              <span className="gradient-text">Supercharged</span>
              {' '}by AI
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 text-balance">
              Upload your travel bookings and let AI create perfect day-by-day itineraries with local recommendations, budget estimates, and personalized tips.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuthenticated ? '/upload' : '/register'}
                className="btn-primary text-lg px-8 py-4"
              >
                <HiOutlineSparkles className="w-5 h-5" />
                Get Started — It's Free
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                See How It Works
                <HiOutlineArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              Everything You Need for Smarter Travel
            </motion.h2>
            <motion.p variants={fadeUp} className="text-dark-400 text-lg max-w-2xl mx-auto">
              From document upload to AI-powered planning — we've got every step covered.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} variants={fadeUp} className="glass-card group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent -z-10" />
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-dark-400 text-lg max-w-xl mx-auto">
              Four simple steps from booking documents to your perfect itinerary.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card text-center relative">
                <span className="text-5xl mb-4 block">{s.emoji}</span>
                <span className="text-xs font-bold text-primary-500 tracking-wider uppercase mb-2 block">Step {s.num}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-dark-400 text-sm">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-dark-600">
                    <HiOutlineArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              Loved by Travelers
            </motion.h2>
            <motion.p variants={fadeUp} className="text-dark-400 text-lg">
              Join thousands of travelers who plan smarter with AI.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card">
                <p className="text-dark-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-dark-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="glass-card text-center py-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/10 -z-10" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Travel Smarter?
            </h2>
            <p className="text-dark-300 text-lg mb-8 max-w-lg mx-auto">
              Upload your first booking document and watch AI create your perfect itinerary in seconds.
            </p>
            <Link
              to={isAuthenticated ? '/upload' : '/register'}
              className="btn-primary text-lg px-10 py-4"
            >
              <HiOutlineSparkles className="w-5 h-5" />
              Start Planning for Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
