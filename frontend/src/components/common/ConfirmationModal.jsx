import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineExclamation, HiOutlineTrash } from 'react-icons/hi';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Trip?',
  message = 'Are you sure you want to delete this itinerary? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="glass-card relative w-full max-w-md p-6 rounded-2xl shadow-2xl border border-dark-700/50 bg-dark-900/90 text-center z-10 flex flex-col items-center"
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              isDangerous 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
            }`}>
              {isDangerous ? (
                <HiOutlineTrash className="w-7 h-7" />
              ) : (
                <HiOutlineExclamation className="w-7 h-7" />
              )}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
            <p className="text-dark-300 text-sm mb-6 leading-relaxed">{message}</p>

            {/* Actions */}
            <div className="flex w-full items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-dark-800 text-dark-100 border border-dark-600 rounded-xl hover:bg-dark-700 hover:border-dark-500 hover:text-white transition-all duration-200 active:scale-[0.98] text-sm font-semibold"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-all duration-300 active:scale-[0.98] text-sm ${
                  isDangerous
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
