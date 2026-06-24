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
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('total');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tripsRes] = await Promise.all([
          itineraryAPI.getStats(),
          itineraryAPI.getAll(),
        ]);
        setStats(statsRes.data);
        setAllTrips(tripsRes.data || []);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDisplayStatus = (trip) => {
    if (trip.status === 'generating') return 'generating';
    if (trip.status === 'failed') return 'failed';
    if (!trip.endDate) return 'upcoming';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(trip.endDate);
    end.setHours(0, 0, 0, 0);
    
    return end < today ? 'completed' : 'upcoming';
  };

  const filteredTrips = allTrips.filter((trip) => {
    if (activeFilter === 'total') return true;
    const displayStatus = getDisplayStatus(trip);
    if (activeFilter === 'upcoming') return displayStatus === 'upcoming';
    if (activeFilter === 'completed') return displayStatus === 'completed';
    if (activeFilter === 'shared') return !!trip.shareId;
    return true;
  });

  const displayTrips = activeFilter === 'total' ? filteredTrips.slice(0, 5) : filteredTrips;

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
            const isActive = activeFilter === key;
            return (
              <motion.button
                key={key}
                variants={item}
                onClick={() => setActiveFilter(key)}
                className={`glass-card flex items-center gap-4 text-left transition-all duration-300 w-full focus:outline-none cursor-pointer ${
                  isActive 
                    ? 'ring-2 ring-primary-500 bg-primary-500/10 border-primary-500/50 scale-[1.02]' 
                    : 'hover:border-dark-600 hover:bg-dark-800/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statColors[key]} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-dark-400 text-sm">{statLabels[key]}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Trips List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-white">
              {activeFilter === 'total' && 'Recent Trips'}
              {activeFilter === 'upcoming' && 'Upcoming Trips'}
              {activeFilter === 'completed' && 'Completed Trips'}
              {activeFilter === 'shared' && 'Shared Trips'}
            </h2>
            {activeFilter !== 'total' && (
              <button 
                onClick={() => setActiveFilter('total')}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="glass-card flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayTrips.length === 0 ? (
            <div className="glass-card text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
                <HiOutlineGlobeAlt className="w-8 h-8 text-dark-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No trips found</h3>
              <p className="text-dark-400 mb-6">
                {activeFilter === 'total' 
                  ? 'Upload your travel documents to get started!' 
                  : `You have no ${activeFilter} trips at the moment.`}
              </p>
              {activeFilter === 'total' ? (
                <Link to="/upload" className="btn-primary">
                  <HiOutlinePlus className="w-5 h-5" />
                  Create Your First Trip
                </Link>
              ) : (
                <button onClick={() => setActiveFilter('total')} className="btn-secondary">
                  Show All Trips
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayTrips.map((trip) => {
                const displayStatus = getDisplayStatus(trip);
                return (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        displayStatus === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : displayStatus === 'upcoming'
                          ? 'bg-amber-500/20 text-amber-400'
                          : displayStatus === 'generating'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {displayStatus}
                      </span>
                      <span className="text-dark-500 text-sm">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
