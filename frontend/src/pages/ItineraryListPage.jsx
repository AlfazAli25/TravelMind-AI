import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { itineraryAPI } from '../api';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineTrash, HiOutlineGlobeAlt } from 'react-icons/hi';
import ConfirmationModal from '../components/common/ConfirmationModal';

const ItineraryListPage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const fetchItineraries = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await itineraryAPI.getAll(searchTerm);
      setItineraries(res.data || []);
    } catch (err) {
      toast.error('Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchItineraries(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openDeleteModal = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setTripToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      await itineraryAPI.delete(tripToDelete);
      setItineraries((prev) => prev.filter((i) => i._id !== tripToDelete));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2">My Trips</h1>
          <p className="text-dark-400 mb-6">All your generated travel itineraries.</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : itineraries.length === 0 ? (
          <div className="glass-card text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
              <HiOutlineGlobeAlt className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {search ? 'No matching trips' : 'No trips yet'}
            </h3>
            <p className="text-dark-400 mb-6">
              {search ? 'Try a different search term.' : 'Upload travel documents to get started!'}
            </p>
            {!search && (
              <Link to="/upload" className="btn-primary">Create Your First Trip</Link>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {itineraries.map((trip, index) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/itinerary/${trip._id}`}
                  className="glass-card block h-full hover:border-primary-500/50 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">✈️</span>
                    </div>
                    <button
                      onClick={(e) => openDeleteModal(trip._id, e)}
                      className="btn-ghost !p-1.5 text-dark-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors mb-1">
                    {trip.destination}
                  </h3>
                  <p className="text-dark-400 text-sm mb-3">
                    {trip.startDate
                      ? `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${trip.endDate ? ` — ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}`
                      : 'No date set'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : trip.status === 'generating'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trip.status}
                    </span>
                    <span className="text-dark-500 text-xs">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTripToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Trip?"
        message="Are you sure you want to delete this travel itinerary? This action cannot be undone."
      />
    </div>
  );
};

export default ItineraryListPage;
