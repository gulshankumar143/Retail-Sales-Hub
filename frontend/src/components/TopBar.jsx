import { useQueryContext } from '../context/QueryContext';

const sortOptions = [
  { label: 'Newest', value: 'date_desc' },
  { label: 'Oldest', value: 'date_asc' },
  { label: 'Amount high to low', value: 'finalAmount_desc' },
  { label: 'Amount low to high', value: 'finalAmount_asc' }
];

const TopBar = ({ theme, onToggleTheme, onExportCSV }) => {
  const { state, dispatch } = useQueryContext();

  const handleSearch = (event) => {
    dispatch({ type: 'SET_QUERY', payload: { search: event.target.value, page: 1 } });
  };

  const handleSort = (event) => {
    const [sortBy, sortOrder] = event.target.value.split('_');
    dispatch({ type: 'SET_QUERY', payload: { sortBy, sortOrder } });
  };

  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.3fr_auto_auto]">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-600">Search customers</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Search name or phone number"
            value={state.search}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-600">Sort by</label>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          value={`${state.sortBy}_${state.sortOrder}`}
          onChange={handleSort}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end justify-end gap-3">
        <button
          type="button"
          onClick={onExportCSV}
          className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >Export CSV</button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
        >{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</button>
      </div>
    </div>
  );
};

export default TopBar;
