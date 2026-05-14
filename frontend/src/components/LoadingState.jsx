import { motion } from 'framer-motion';

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-8"
  >
    {/* Header Skeleton */}
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg animate-pulse" />
        <div className="h-4 w-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-pulse" />
      </div>
      <div className="h-10 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-xl animate-pulse" />
    </div>

    {/* Table Skeleton */}
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-8 gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowIndex * 0.1 }}
          className="grid grid-cols-8 gap-4 py-4"
        >
          {Array.from({ length: 8 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-pulse"
              style={{
                width: colIndex === 0 ? '90%' : colIndex === 1 ? '80%' : `${Math.random() * 30 + 50}%`,
                animationDelay: `${(rowIndex * 8 + colIndex) * 0.1}s`
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>

    {/* Loading Text */}
    <div className="text-center mt-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-3"
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">Loading sales data...</p>
    </div>
  </motion.div>
);

export default LoadingState;
