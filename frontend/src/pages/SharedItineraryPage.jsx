import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shareAPI } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CURRENCY_NAMES, formatCurrency, parseAndConvertCost } from '../utils/currency';

const ACTIVITY_COLORS = {
  flight: 'border-blue-500 bg-blue-500/10',
  hotel: 'border-amber-500 bg-amber-500/10',
  transport: 'border-cyan-500 bg-cyan-500/10',
  food: 'border-orange-500 bg-orange-500/10',
  attraction: 'border-emerald-500 bg-emerald-500/10',
  activity: 'border-purple-500 bg-purple-500/10',
  rest: 'border-dark-500 bg-dark-500/10',
};

const SharedItineraryPage = () => {
  const { shareId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await shareAPI.getShared(shareId);
        setItinerary(res.data);
      } catch {
        setError('Itinerary not found or no longer available.');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading shared itinerary..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
            <span className="text-3xl">🔗</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Not Found</h2>
          <p className="text-dark-400">{error}</p>
        </div>
      </div>
    );
  }

  const plan = itinerary?.itinerary || {};
  const days = plan.days || [];

  return (
    <div className="min-h-screen pb-12">
      {/* Header Bar */}
      <div className="glass border-b border-dark-700/50 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold gradient-text">TravelMind AI</span>
          </div>
          <span className="text-dark-500 text-sm">Shared Itinerary</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* Trip Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text mb-2">
            {plan.tripTitle || itinerary.destination}
          </h1>
          <p className="text-dark-400">{plan.summary}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-dark-300">
            <span>📍 {plan.destination || itinerary.destination}</span>
            <span>🗓️ {days.length} days</span>
            {itinerary.startDate && (
              <span>
                📅 {new Date(itinerary.startDate).toLocaleDateString()} — {new Date(itinerary.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* Budget Breakdown */}
        {plan.totalEstimatedBudget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-display font-semibold text-white">💰 Budget Estimate</h2>
              <div className="flex items-center gap-2 self-end">
                <span className="text-xs text-dark-400">Currency:</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-dark-800/80 border border-dark-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 cursor-pointer"
                >
                  {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
                    <option key={code} value={code} className="bg-dark-900">
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(plan.totalEstimatedBudget)
                .filter(([key]) => key !== 'currency' && key !== 'total')
                .map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-dark-800/50 rounded-xl">
                    <p className="text-xs text-dark-400 capitalize mb-1">{key}</p>
                    <p className="text-white font-semibold">
                      {typeof value === 'number'
                        ? formatCurrency(value, plan.totalEstimatedBudget.currency || 'USD', selectedCurrency)
                        : value}
                    </p>
                  </div>
                ))}
              <div className="text-center p-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl border border-primary-500/30">
                <p className="text-xs text-primary-300 mb-1">Total</p>
                <p className="text-white font-bold text-lg">
                  {formatCurrency(plan.totalEstimatedBudget.total, plan.totalEstimatedBudget.currency || 'USD', selectedCurrency)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Day Tabs */}
        {days.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeDay === index
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                }`}
              >
                Day {day.dayNumber || index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Timeline */}
        {days.length > 0 && (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-semibold text-white">
                  {days[activeDay]?.title || `Day ${activeDay + 1}`}
                </h2>
                {days[activeDay]?.date && (
                  <p className="text-dark-400 text-sm mt-1">
                    {new Date(days[activeDay].date).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                )}
              </div>
              {days[activeDay]?.dailyBudget && (
                <div className="text-right">
                  <p className="text-xs text-dark-400">Daily Budget</p>
                  <p className="text-white font-semibold">
                    {formatCurrency(days[activeDay].dailyBudget.estimated, plan.totalEstimatedBudget.currency || 'USD', selectedCurrency)}
                  </p>
                </div>
              )}
            </div>
            <div className="relative pl-8">
              <div className="timeline-line" />
              {(days[activeDay]?.activities || []).map((activity, aIndex) => (
                <div key={aIndex} className="relative mb-6 last:mb-0">
                  <div className="timeline-dot flex items-center justify-center">
                    <span className="text-[10px]">{activity.icon || '📍'}</span>
                  </div>
                  <div className={`ml-6 p-4 rounded-xl border-l-2 ${ACTIVITY_COLORS[activity.type] || 'border-dark-600 bg-dark-800/50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {activity.time && (
                            <span className="text-xs font-mono text-dark-400 bg-dark-800 px-2 py-0.5 rounded">
                              {activity.time}
                            </span>
                          )}
                          <span className="text-xs text-dark-500 capitalize">
                            {activity.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white">{activity.title}</h3>
                        <p className="text-dark-400 text-sm mt-1">{activity.description}</p>
                        {activity.location && (
                          <p className="text-dark-500 text-xs mt-2">📍 {activity.location}</p>
                        )}
                        {activity.tips && (
                          <p className="text-primary-400/80 text-xs mt-1 italic">💡 {activity.tips}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {activity.duration && (
                          <p className="text-dark-500 text-xs">{activity.duration}</p>
                        )}
                        {activity.estimatedCost && (
                          <p className="text-dark-400 text-xs font-medium">
                            {parseAndConvertCost(activity.estimatedCost, plan.totalEstimatedBudget.currency || 'USD', selectedCurrency)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Travel Tips */}
        {plan.travelTips?.length > 0 && (
          <div className="glass-card mt-6">
            <h2 className="text-lg font-display font-semibold text-white mb-4">🧳 Travel Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.travelTips.map((tip, i) => (
                <div key={i} className="p-3 bg-dark-800/50 rounded-xl">
                  <span className="text-xs font-medium text-primary-400 uppercase">{tip.category}</span>
                  <p className="text-dark-300 text-sm mt-1">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedItineraryPage;
