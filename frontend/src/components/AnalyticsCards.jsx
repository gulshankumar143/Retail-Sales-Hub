import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  MapPin,
  Box,
  Sparkles,
  Layers
} from 'lucide-react';

const metrics = [
  {
    label: 'Total Revenue',
    key: 'totalRevenue',
    icon: DollarSign,
    symbol: '$',
    gradient: 'from-emerald-500 to-teal-600',
    trend: 'Sales performance'
  },
  {
    label: 'Total Orders',
    key: 'totalOrders',
    icon: ShoppingBag,
    symbol: '',
    gradient: 'from-blue-500 to-indigo-600',
    trend: 'Order volume'
  },
  {
    label: 'Avg Order Value',
    key: 'avgOrderValue',
    icon: Sparkles,
    symbol: '$',
    gradient: 'from-purple-500 to-pink-600',
    trend: 'Revenue per order'
  },
  {
    label: 'Conversion Rate',
    key: 'conversionRate',
    icon: TrendingUp,
    symbol: '%',
    gradient: 'from-orange-500 to-red-600',
    trend: 'Order success'
  },
  {
    label: 'Customers',
    key: 'totalCustomers',
    icon: Users,
    symbol: '',
    gradient: 'from-sky-500 to-cyan-600',
    trend: 'Customer base'
  },
  {
    label: 'Products Sold',
    key: 'productsSold',
    icon: Box,
    symbol: '',
    gradient: 'from-amber-500 to-orange-600',
    trend: 'Units sold'
  },
  {
    label: 'Top Region',
    key: 'topRegion',
    icon: MapPin,
    symbol: '',
    gradient: 'from-fuchsia-500 to-violet-600',
    trend: 'Highest performing region'
  },
  {
    label: 'Monthly Growth',
    key: 'monthlyRevenueGrowth',
    icon: Layers,
    symbol: '%',
    gradient: 'from-indigo-500 to-slate-600',
    trend: 'MoM growth'
  }
];

const AnalyticsCards = ({ summary = {}, isLoading }) => {
  const stats = {
    totalRevenue: summary.totalRevenue || 0,
    totalOrders: summary.totalOrders || 0,
    avgOrderValue: summary.avgOrderValue || 0,
    conversionRate: summary.conversionRate || 0,
    totalCustomers: summary.totalCustomers || 0,
    productsSold: summary.productsSold || 0,
    topRegion: summary.topRegion || '—',
    monthlyRevenueGrowth: summary.monthlyRevenueGrowth || 0
  };

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, staggerChildren: 0.08 }}
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const value = stats[metric.key];
        const formatted = metric.key === 'topRegion'
          ? value
          : metric.key === 'conversionRate' || metric.key === 'monthlyRevenueGrowth'
          ? `${Number(value).toFixed(1)}%`
          : metric.key === 'avgOrderValue' || metric.key === 'totalRevenue'
          ? `$${Number(value).toLocaleString()}`
          : Number(value).toLocaleString();

        return (
          <motion.div
            key={metric.key}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`inline-flex items-center justify-center rounded-3xl p-3 text-white bg-gradient-to-br ${metric.gradient} mb-4 shadow-lg shadow-indigo-500/15`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-3xl font-semibold text-slate-900 dark:text-white">{isLoading ? '—' : formatted}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {metric.trend}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-transparent dark:from-slate-950" />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default AnalyticsCards;
