import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Calendar, RotateCcw } from 'lucide-react';
import { useQueryContext } from '../context/QueryContext';
import useDashboardFilters from '../hooks/useDashboardFilters';

const defaultOptions = {
  region: [],
  gender: [],
  category: [],
  tags: [],
  paymentMethod: [],
  customerType: [],
  orderStatus: [],
  deliveryType: [],
};

const FilterAccordion = ({
  title,
  isOpen,
  onToggle,
  children,
}) => (
  <div className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg px-1 py-4 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
    >
      <span className="font-medium text-slate-900 dark:text-white">
        {title}
      </span>

      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </motion.div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="overflow-hidden"
        >
          <div className="pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FilterChip = ({
  label,
  isSelected,
  onClick,
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isSelected
        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {label}
  </motion.button>
);

const FilterPanel = () => {
  const { state, dispatch } = useQueryContext();

  const {
    data,
    isLoading: isFiltersLoading,
  } = useDashboardFilters();

  const options = {
    ...defaultOptions,
    ...(data || {}),
  };

  const [openSections, setOpenSections] = useState({
    region: true,
    gender: false,
    category: false,
    tags: false,
    paymentMethod: false,
    customerType: false,
    orderStatus: false,
    deliveryType: false,
    age: false,
    date: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleValue = (field, option) => {
    const currentValues = Array.isArray(state[field])
      ? state[field]
      : [];

    const newValues = currentValues.includes(option)
      ? currentValues.filter((item) => item !== option)
      : [...currentValues, option];

    dispatch({
      type: 'SET_QUERY',
      payload: {
        [field]: newValues,
        page: 1,
      },
    });
  };

  const handleRange = (field) => (event) => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        [field]: event.target.value,
        page: 1,
      },
    });
  };

  const handleDate = (field) => (event) => {
    dispatch({
      type: 'SET_QUERY',
      payload: {
        [field]: event.target.value,
        page: 1,
      },
    });
  };

  const clearFilters = () => {
    dispatch({ type: 'RESET' });
  };

  const applyFilters = () => {
    console.log('Filters applied');
  };

  if (isFiltersLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80"
    >
      {/* Header */}
      <div className="border-b border-slate-200/50 p-6 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
              <Filter className="h-5 w-5 text-white" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Filters
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Refine your results
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-1 p-6">
        {/* Region */}
        <FilterAccordion
          title="Region"
          isOpen={openSections.region}
          onToggle={() => toggleSection('region')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.region || []).map((region) => (
              <FilterChip
                key={region}
                label={region}
                isSelected={(state.region || []).includes(region)}
                onClick={() => toggleValue('region', region)}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Gender */}
        <FilterAccordion
          title="Gender"
          isOpen={openSections.gender}
          onToggle={() => toggleSection('gender')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.gender || []).map((gender) => (
              <FilterChip
                key={gender}
                label={gender}
                isSelected={(state.gender || []).includes(gender)}
                onClick={() => toggleValue('gender', gender)}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Category */}
        <FilterAccordion
          title="Category"
          isOpen={openSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.category || []).map((category) => (
              <FilterChip
                key={category}
                label={category}
                isSelected={(state.category || []).includes(category)}
                onClick={() => toggleValue('category', category)}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Tags */}
        <FilterAccordion
          title="Tags"
          isOpen={openSections.tags}
          onToggle={() => toggleSection('tags')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.tags || []).map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                isSelected={(state.tags || []).includes(tag)}
                onClick={() => toggleValue('tags', tag)}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Payment Method */}
        <FilterAccordion
          title="Payment Method"
          isOpen={openSections.paymentMethod}
          onToggle={() => toggleSection('paymentMethod')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.paymentMethod || []).map((method) => (
              <FilterChip
                key={method}
                label={method}
                isSelected={(state.paymentMethod || []).includes(method)}
                onClick={() =>
                  toggleValue('paymentMethod', method)
                }
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Customer Type */}
        <FilterAccordion
          title="Customer Type"
          isOpen={openSections.customerType}
          onToggle={() => toggleSection('customerType')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.customerType || []).map((type) => (
              <FilterChip
                key={type}
                label={type}
                isSelected={(state.customerType || []).includes(type)}
                onClick={() =>
                  toggleValue('customerType', type)
                }
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Order Status */}
        <FilterAccordion
          title="Order Status"
          isOpen={openSections.orderStatus}
          onToggle={() => toggleSection('orderStatus')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.orderStatus || []).map((status) => (
              <FilterChip
                key={status}
                label={status}
                isSelected={(state.orderStatus || []).includes(status)}
                onClick={() =>
                  toggleValue('orderStatus', status)
                }
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Delivery Type */}
        <FilterAccordion
          title="Delivery Type"
          isOpen={openSections.deliveryType}
          onToggle={() => toggleSection('deliveryType')}
        >
          <div className="flex flex-wrap gap-2">
            {(options.deliveryType || []).map((delivery) => (
              <FilterChip
                key={delivery}
                label={delivery}
                isSelected={(state.deliveryType || []).includes(
                  delivery
                )}
                onClick={() =>
                  toggleValue('deliveryType', delivery)
                }
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Age Range */}
        <FilterAccordion
          title="Age Range"
          isOpen={openSections.age}
          onToggle={() => toggleSection('age')}
        >
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Min Age
                </label>

                <input
                  value={state.minAge || ''}
                  placeholder="Min"
                  onChange={handleRange('minAge')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800"
                  type="number"
                  min="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Max Age
                </label>

                <input
                  value={state.maxAge || ''}
                  placeholder="Max"
                  onChange={handleRange('maxAge')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800"
                  type="number"
                  min="0"
                />
              </div>
            </div>
          </div>
        </FilterAccordion>

        {/* Date Range */}
        <FilterAccordion
          title="Date Range"
          isOpen={openSections.date}
          onToggle={() => toggleSection('date')}
        >
          <div className="grid gap-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Start Date
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />

                  <input
                    value={state.startDate || ''}
                    onChange={handleDate('startDate')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800"
                    type="date"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  End Date
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />

                  <input
                    value={state.endDate || ''}
                    onChange={handleDate('endDate')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700 dark:bg-slate-800"
                    type="date"
                  />
                </div>
              </div>
            </div>
          </div>
        </FilterAccordion>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/50 p-6 dark:border-slate-700/50">
        <motion.button
          type="button"
          onClick={applyFilters}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Apply Filters
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;