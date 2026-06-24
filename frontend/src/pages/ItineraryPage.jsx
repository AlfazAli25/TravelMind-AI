import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { itineraryAPI } from '../api';
import toast from 'react-hot-toast';
import {
  HiOutlineShare,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineChat,
  HiOutlineArrowLeft,
  HiOutlineClipboard,
} from 'react-icons/hi';
import ChatPanel from '../components/chat/ChatPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../components/common/ConfirmationModal';
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

const ItineraryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await itineraryAPI.getById(id);
        setItinerary(res.data);
      } catch (err) {
        toast.error('Failed to load itinerary');
        navigate('/itineraries');
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id, navigate]);

  const confirmDelete = async () => {
    try {
      await itineraryAPI.delete(id);
      toast.success('Itinerary deleted');
      navigate('/itineraries');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${itinerary.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const handleExportPDF = async () => {
    const makePdfSafeText = (text) => {
      if (typeof text !== 'string') return text;
      // Convert rupee symbol to Rs. and euro to EUR
      let safe = text
        .replace(/₹/g, 'Rs. ')
        .replace(/€/g, 'EUR ');
      // Strip emojis (surrogate pairs and dingbats/miscellaneous symbols)
      safe = safe.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF\uFE0F]/g, '');
      return safe.trim();
    };

    const loadingToast = toast.loading('Generating PDF...');
    try {
      const { default: jsPDF } = await import('jspdf');
      window.jsPDF = jsPDF; // Assign jsPDF to window object for jspdf-autotable extension
      await import('jspdf-autotable');
      const doc = new jsPDF();
      const title = makePdfSafeText(plan.tripTitle || itinerary.destination || 'TravelMind Itinerary');

      // First Page Header Banner
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, 210, 45, 'F');

      // Title in White
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(title, 14, 18);

      // Subtitle / Destination & Dates
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(220, 225, 255);
      doc.text(makePdfSafeText(`Destination: ${plan.destination || itinerary.destination || ''}`), 14, 28);
      if (itinerary.startDate) {
        const start = new Date(itinerary.startDate);
        const end = new Date(itinerary.endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          doc.text(makePdfSafeText(`Dates: ${start.toLocaleDateString()} — ${end.toLocaleDateString()}  |  ${days.length} Days`), 14, 34);
        }
      }

      let yPos = 55;

      // Budget Breakdown Table
      if (plan.totalEstimatedBudget) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(17, 24, 39);
        doc.text('Budget Summary', 14, yPos);
        yPos += 5;

        const budgetItems = Object.entries(plan.totalEstimatedBudget)
          .filter(([key]) => key !== 'currency' && key !== 'total')
          .map(([key, value]) => [
            makePdfSafeText(key.charAt(0).toUpperCase() + key.slice(1)),
            typeof value === 'number'
              ? makePdfSafeText(formatCurrency(value, plan.totalEstimatedBudget.currency || 'USD', selectedCurrency))
              : makePdfSafeText(value),
          ]);
        budgetItems.push([
          'Total Estimated Budget',
          makePdfSafeText(formatCurrency(plan.totalEstimatedBudget.total, plan.totalEstimatedBudget.currency || 'USD', selectedCurrency)),
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Category', 'Cost']],
          body: budgetItems,
          theme: 'striped',
          styles: { fontSize: 8.5, cellPadding: 2.5 },
          headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80, halign: 'right', fontStyle: 'bold' },
          },
          margin: { left: 14 },
        });
        yPos = doc.lastAutoTable.finalY + 12;
      }

      // Day-by-day Itinerary
      for (const day of days) {
        if (yPos > 240) { doc.addPage(); yPos = 25; }

        // Premium left highlight bar next to day header
        doc.setFillColor(99, 102, 241);
        doc.rect(14, yPos - 4.5, 3.5, 6.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(17, 24, 39);
        doc.text(makePdfSafeText(`Day ${day.dayNumber || ''}: ${day.title || ''}`), 20, yPos);
        yPos += 5;

        if (day.activities?.length) {
          const tableData = day.activities.map((a) => [
            makePdfSafeText(a.time || ''),
            makePdfSafeText(a.title || ''),
            makePdfSafeText(a.description || ''),
            a.estimatedCost ? makePdfSafeText(parseAndConvertCost(a.estimatedCost, plan.totalEstimatedBudget?.currency || 'USD', selectedCurrency)) : '',
          ]);

          doc.autoTable({
            startY: yPos,
            head: [['Time', 'Activity', 'Description', 'Cost']],
            body: tableData,
            theme: 'striped',
            styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
            headStyles: { fillColor: [99, 102, 241], fontStyle: 'bold', textColor: [255, 255, 255] },
            columnStyles: {
              0: { cellWidth: 22 },
              1: { cellWidth: 45, fontStyle: 'bold' },
              2: { cellWidth: 90 },
              3: { cellWidth: 25, halign: 'right' },
            },
            margin: { left: 14 },
          });
          yPos = doc.lastAutoTable.finalY + 12;
        }
      }

      // Travel Tips
      if (plan.travelTips?.length) {
        if (yPos > 230) { doc.addPage(); yPos = 25; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(17, 24, 39);
        doc.text('Practical Travel Tips', 14, yPos);
        yPos += 5;

        const tipsData = plan.travelTips.map((tip) => [
          makePdfSafeText(tip.category.toUpperCase()),
          makePdfSafeText(tip.tip),
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Category', 'Tip / Suggestion']],
          body: tipsData,
          theme: 'grid',
          styles: { fontSize: 8.5, cellPadding: 3 },
          headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold', textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold', textColor: [99, 102, 241] },
            1: { cellWidth: 147 },
          },
          margin: { left: 14 },
        });
      }

      // Add footers & subpage headers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(150);

        // Footer
        doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: 'right' });
        doc.text('Powered by TravelMind AI', 14, 287);

        // Thin top line header on subsequent pages
        if (i > 1) {
          doc.setDrawColor(230);
          doc.line(14, 13, 196, 13);
          doc.text(makePdfSafeText(title), 14, 10);
          doc.text('Travel Itinerary', 196, 10, { align: 'right' });
        }
      }

      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      toast.dismiss(loadingToast);
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.dismiss(loadingToast);
      toast.error('Failed to export PDF itinerary.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading itinerary..." />
      </div>
    );
  }

  const plan = itinerary?.itinerary || {};
  const days = plan.days || [];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        {/* Back + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <button onClick={() => navigate('/itineraries')} className="btn-ghost">
            <HiOutlineArrowLeft className="w-5 h-5" /> Back to Trips
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleShare} className="btn-secondary text-sm">
              <HiOutlineShare className="w-4 h-4" /> Share
            </button>
            <button onClick={handleExportPDF} className="btn-secondary text-sm">
              <HiOutlineDownload className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={() => setChatOpen(true)} className="btn-primary text-sm">
              <HiOutlineChat className="w-4 h-4" /> AI Assistant
            </button>
            <button onClick={() => setDeleteModalOpen(true)} className="btn-danger text-sm">
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div id="itinerary-content">
          {/* Trip Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">
                  {plan.tripTitle || itinerary.destination}
                </h1>
                <p className="text-dark-400 mt-1">{plan.summary}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-dark-300">
                  <span>📍 {plan.destination || itinerary.destination}</span>
                  {itinerary.startDate && (
                    <span>📅 {new Date(itinerary.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      {itinerary.endDate && ` — ${new Date(itinerary.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                    </span>
                  )}
                  <span>🗓️ {days.length} days</span>
                </div>
              </div>
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
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDay(index)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeDay === index
                      ? 'bg-primary-500 text-white shadow-glow-primary'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  Day {day.dayNumber || index + 1}
                </button>
              ))}
            </div>
          )}

          {/* Active Day Timeline */}
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

              {/* Timeline */}
              <div className="relative pl-8">
                <div className="timeline-line" />
                {(days[activeDay]?.activities || []).map((activity, aIndex) => (
                  <motion.div
                    key={aIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: aIndex * 0.05 }}
                    className="relative mb-6 last:mb-0"
                  >
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
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Travel Tips */}
          {plan.travelTips?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card mt-6"
            >
              <h2 className="text-lg font-display font-semibold text-white mb-4">🧳 Travel Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.travelTips.map((tip, index) => (
                  <div key={index} className="p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-xs font-medium text-primary-400 uppercase">{tip.category}</span>
                    <p className="text-dark-300 text-sm mt-1">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        itineraryId={id}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Itinerary?"
        message="Are you sure you want to delete this trip itinerary? This action cannot be undone."
      />
    </div>
  );
};

export default ItineraryPage;
