import { motion } from 'framer-motion';
import { Plus, Search, BarChart3 } from 'lucide-react';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-16 px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
  >
    {/* Illustration */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', damping: 20 }}
      className="relative mb-8"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800/30 dark:to-purple-800/30 rounded-full flex items-center justify-center">
          <BarChart3 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus className="w-4 h-4 text-white" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg"
      >
        <Search className="w-3 h-3 text-white" />
      </motion.div>
    </motion.div>

    {/* Content */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-center max-w-md"
    >
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        No sales records found
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        It looks like there are no sales records matching your current filters.
        Try adjusting your search criteria or add a new sales record to get started.
      </p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
        <span>Add Sales Record</span>
      </motion.button>
    </motion.div>

    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-500 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500 rounded-full blur-xl" />
    </div>
  </motion.div>
);

export default EmptyState;
