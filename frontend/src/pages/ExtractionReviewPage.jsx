import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { itineraryAPI } from '../api';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineSparkles, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const SECTIONS = [
  { key: 'flights', label: 'Flights', emoji: '✈️', fields: ['airline', 'flightNumber'] },
  { key: 'hotels', label: 'Hotels', emoji: '🏨', fields: ['name', 'checkIn', 'checkOut'] },
  { key: 'trains', label: 'Trains', emoji: '🚂', fields: ['trainNumber', 'operator'] },
  { key: 'buses', label: 'Buses', emoji: '🚌', fields: ['operator', 'busNumber'] },
  { key: 'bookings', label: 'Other Bookings', emoji: '📋', fields: ['type', 'name', 'date'] },
];

const ExtractionReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { extractedData: initialData, uploadIds } = location.state || {};
  const [data, setData] = useState(initialData || {});
  const [generating, setGenerating] = useState(false);

  if (!initialData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="glass-card text-center max-w-md">
          <p className="text-white font-semibold mb-4">No extracted data found</p>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setData((prev) => {
      const arr = [...(prev[section] || [])];
      if (typeof arr[index] === 'object') {
        arr[index] = { ...arr[index], [field]: value };
      }
      return { ...prev, [section]: arr };
    });
  };

  const removeArrayItem = (section, index) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await itineraryAPI.generate({ extractedData: data, uploadIds });
      toast.success('Itinerary generated!');
      navigate(`/itinerary/${response.data._id}`);
    } catch (err) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <HiOutlinePencil className="w-6 h-6 text-primary-400" />
            <h1 className="section-title">Review Extracted Data</h1>
          </div>
          <p className="text-dark-400 mb-8">
            Review and edit the information extracted from your documents before generating the itinerary.
          </p>
        </motion.div>

        {/* Core fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card mb-6"
        >
          <h2 className="text-lg font-display font-semibold text-white mb-4">Trip Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Destination</label>
              <input
                className="input-field"
                value={data.destination || ''}
                onChange={(e) => updateField('destination', e.target.value)}
                placeholder="e.g. Paris, France"
              />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={data.startDate || ''}
                onChange={(e) => updateField('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                className="input-field"
                value={data.endDate || ''}
                onChange={(e) => updateField('endDate', e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Booking sections */}
        {SECTIONS.map((section, sIndex) => {
          const items = data[section.key] || [];
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + sIndex * 0.05 }}
              className="glass-card mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <span>{section.emoji}</span> {section.label}
                  <span className="text-dark-500 text-sm font-normal">({items.length})</span>
                </h2>
              </div>

              {items.length === 0 ? (
                <p className="text-dark-500 text-sm">No {section.label.toLowerCase()} found in documents.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="p-3 bg-dark-800/80 rounded-xl border border-dark-700">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-dark-500 font-medium">
                          {section.label} #{index + 1}
                        </span>
                        <button
                          onClick={() => removeArrayItem(section.key, index)}
                          className="btn-ghost !p-1 text-dark-500 hover:text-red-400"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(item).map(([field, value]) => {
                          if (typeof value === 'object' && value !== null) {
                            return Object.entries(value).map(([subField, subVal]) => (
                              <div key={`${field}.${subField}`}>
                                <label className="text-xs text-dark-500 capitalize">
                                  {field} {subField}
                                </label>
                                <input
                                  className="input-field !py-2 !text-sm"
                                  value={subVal || ''}
                                  onChange={(e) => {
                                    const newItem = { ...item, [field]: { ...value, [subField]: e.target.value } };
                                    const arr = [...(data[section.key] || [])];
                                    arr[index] = newItem;
                                    setData((prev) => ({ ...prev, [section.key]: arr }));
                                  }}
                                />
                              </div>
                            ));
                          }
                          if (Array.isArray(value)) return null;
                          return (
                            <div key={field}>
                              <label className="text-xs text-dark-500 capitalize">{field}</label>
                              <input
                                className="input-field !py-2 !text-sm"
                                value={value || ''}
                                onChange={(e) => updateArrayItem(section.key, index, field, e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Generate button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-4 mt-8"
        >
          <button
            onClick={handleGenerate}
            disabled={generating || !data.destination}
            className="btn-primary w-full text-lg py-4 shadow-glow-primary"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Itinerary...
              </>
            ) : (
              <>
                <HiOutlineSparkles className="w-6 h-6" />
                Generate AI Itinerary
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ExtractionReviewPage;
