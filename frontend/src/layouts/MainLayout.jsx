import { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  ShoppingCart,
  Users,
  FileText,
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Filter
} from 'lucide-react';

import { useQueryContext } from '../context/QueryContext';

const navItems = [
  { label: 'Overview', icon: BarChart3, to: '/overview' },
  { label: 'Sales', icon: ShoppingCart, to: '/sales' },
  { label: 'Customers', icon: Users, to: '/customers' },
  { label: 'Reports', icon: FileText, to: '/reports' }
];

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { state, dispatch } = useQueryContext();

  const location = useLocation();

  const currentPage = useMemo(() => {
    if (location.pathname.startsWith('/sales')) return 'Sales';
    if (location.pathname.startsWith('/customers')) return 'Customers';
    if (location.pathname.startsWith('/reports')) return 'Reports';

    return 'Overview';
  }, [location.pathname]);

  const handleSearch = (event) => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        search: event.target.value,
        page: 1
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 280
            }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-800/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      Retail
                    </p>

                    <h1 className="text-2xl font-semibold text-white">
                      Sales Hub
                    </h1>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2 px-4 py-6">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className="h-5 w-5" />

                          <span>{item.label}</span>

                          {isActive && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-indigo-400" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-slate-800/60 p-4">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-800/50 bg-slate-900/80 p-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <User className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      Gulshan Kumar
                    </p>

                    <p className="text-xs text-slate-400">
                      Admin
                    </p>
                  </div>

                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-80' : ''
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90">
          <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dashboard
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Retail analytics workspace
                  </h2>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {currentPage}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="relative hidden w-full max-w-sm md:inline-flex">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={state.search || ''}
                  onChange={handleSearch}
                  placeholder="Search customers, products, or orders"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                <Filter className="h-4 w-4" />
              </button>

              <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5" />

                <span className="absolute -right-1 -top-1 inline-flex h-3 w-3 rounded-full bg-rose-500" />
              </button>

              <button className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/15 transition hover:shadow-indigo-500/25">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950 px-3 text-white dark:bg-slate-900">
                  <User className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="w-full px-6 py-6">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;