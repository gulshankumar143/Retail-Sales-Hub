import { useQueryContext } from '../context/QueryContext';

const PaginationControls = ({ meta }) => {
  const { state, dispatch } = useQueryContext();

  const goToPage = (page) => {
    dispatch({ type: 'SET_QUERY', payload: { page } });
  };

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1).slice(0, 6);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500 dark:text-slate-400">Showing page {meta.currentPage} of {meta.totalPages}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => goToPage(Math.max(state.page - 1, 1))}
          disabled={state.page <= 1}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >Prev</button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`rounded-2xl px-4 py-2 text-sm ${state.page === page ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'}`}
          >{page}</button>
        ))}
        <button
          onClick={() => goToPage(Math.min(state.page + 1, meta.totalPages))}
          disabled={state.page >= meta.totalPages}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >Next</button>
      </div>
    </div>
  );
};

export default PaginationControls;
