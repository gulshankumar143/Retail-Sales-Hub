import { useMemo } from 'react';
import { RefreshCcw } from 'lucide-react';

import FilterPanel from '../components/FilterPanel';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import PaginationControls from '../components/PaginationControls';
import SalesTable from '../components/SalesTable';

import useSalesQuery from '../hooks/useSalesQuery';
import { useQueryContext } from '../context/QueryContext';

import MainLayout from '../layouts/MainLayout';

const Sales = () => {
  const { state } = useQueryContext();

  const {
    data: salesData,
    meta,
    isLoading,
    isError,
    error
  } = useSalesQuery();

  const sales = salesData || [];

  const metaData = meta || {
    currentPage: 1,
    totalPages: 1
  };

  const recordCount = sales.length;

  const headerSubtitle = useMemo(() => {
    if (isLoading) {
      return 'Loading sales records...';
    }

    return `${recordCount.toLocaleString()} record${
      recordCount === 1 ? '' : 's'
    } found`;
  }, [isLoading, recordCount]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-500">
                Sales
              </p>

              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                Sales management
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {headerSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="sticky top-28 self-start">
            <FilterPanel />
          </aside>

          {/* Sales Section */}
          <section className="space-y-6">
            {/* Loading */}
            {isLoading && <LoadingState />}

            {/* Error */}
            {isError && (
              <ErrorState
                message={
                  error?.message || 'Failed to load sales data.'
                }
              />
            )}

            {/* Empty State */}
            {!isLoading &&
              !isError &&
              (sales || []).length === 0 && <EmptyState />}

            {/* Sales Table */}
            {!isLoading &&
              !isError &&
              (sales || []).length > 0 && (
                <>
                  <SalesTable records={sales || []} />

                  <PaginationControls
                    meta={metaData}
                  />
                </>
              )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sales;