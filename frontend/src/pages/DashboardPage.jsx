import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { itineraryAPI } from '../api';
import { HiOutlineGlobeAlt, HiOutlineCalendar, HiOutlineCheck, HiOutlineShare, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statIcons = {
  total: HiOutlineGlobeAlt,
  upcoming: HiOutlineCalendar,
  completed: HiOutlineCheck,
  shared: HiOutlineShare,
};

const statLabels = {
  total: 'Total Trips',
  upcoming: 'Upcoming',
  completed: 'Completed',
  shared: 'Shared',
};

const statColors = {
  total: 'from-primary-500 to-blue-500',
  upcoming: 'from-amber-500 to-orange-500',
  completed: 'from-emerald-500 to-teal-500',
  shared: 'from-accent-500 to-pink-500',
};

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, shared: 0 });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tripsRes] = await Promise.all([
          itineraryAPI.getStats(),
          itineraryAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setRecentTrips(tripsRes.data?.slice(0, 5) || []);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-dark-400 mt-1">Welcome back! Here's your travel overview.</p>
          </div>
          <Link to="/upload" className="btn-primary">
            <HiOutlinePlus className="w-5 h-5" />
            New Trip
          </Link>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {Object.entries(stats).map(([key, value]) => {
            const Icon = statIcons[key];
            return (
              <motion.div
                key={key}
                variants={item}
                className="glass-card flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statColors[key]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-dark-400 text-sm">{statLabels[key]}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-display font-semibold text-white mb-4">Recent Trips</h2>
          {loading ? (
            <div className="glass-card flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentTrips.length === 0 ? (
            <div className="glass-card text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
                <HiOutlineGlobeAlt className="w-8 h-8 text-dark-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No trips yet</h3>
              <p className="text-dark-400 mb-6">Upload your travel documents to get started!</p>
              <Link to="/upload" className="btn-primary">
                <HiOutlinePlus className="w-5 h-5" />
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTrips.map((trip) => (
                <Link
                  key={trip._id}
                  to={`/itinerary/${trip._id}`}
                  className="glass-card flex items-center justify-between hover:border-primary-500/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                      <span className="text-lg">✈️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {trip.destination}
                      </h3>
                      <p className="text-dark-400 text-sm">
                        {trip.startDate
                          ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'No date'}
                        {trip.endDate &&
                          ` — ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : trip.status === 'generating'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trip.status}
                    </span>
                    <span className="text-dark-500 text-sm">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
