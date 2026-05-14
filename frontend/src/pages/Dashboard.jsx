import { useMemo } from 'react';
import { DownloadCloud, RefreshCcw } from 'lucide-react';

import AnalyticsCards from '../components/AnalyticsCards';
import ChartsSection from '../components/ChartsSection';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import FilterPanel from '../components/FilterPanel';
import LoadingState from '../components/LoadingState';
import PaginationControls from '../components/PaginationControls';
import SalesTable from '../components/SalesTable';

import useDashboardSummary from '../hooks/useDashboardSummary';
import useDashboardCharts from '../hooks/useDashboardCharts';
import useDashboardFilters from '../hooks/useDashboardFilters';
import useSalesQuery from '../hooks/useSalesQuery';

import MainLayout from '../layouts/MainLayout';

import { exportSalesCsv } from '../services/dashboard';

import { useQueryContext } from '../context/QueryContext';

const Dashboard = () => {
  const { state } = useQueryContext();

  const salesQuery = useSalesQuery();

  const summaryQuery = useDashboardSummary();

  const chartsQuery = useDashboardCharts();

  const filtersQuery = useDashboardFilters();

  const {
    data: salesData,
    meta: salesMeta,
    isLoading: isTableLoading,
    isError,
    error
  } = salesQuery;

  const sales = Array.isArray(salesData)
    ? salesData
    : salesData?.data || [];

  const meta = salesMeta || {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 12
  };

  const {
    data: summary = {},
    isLoading: isSummaryLoading
  } = summaryQuery;

  const {
    data: charts = {},
    isLoading: isChartsLoading
  } = chartsQuery;

  const {
    isLoading: isFiltersLoading
  } = filtersQuery;

  const recordCount = sales.length;

  const isBusy =
    isTableLoading ||
    isSummaryLoading ||
    isChartsLoading ||
    isFiltersLoading;

  const handleExportCSV = async () => {
    try {
      const blob = await exportSalesCsv(state);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute(
        'download',
        `sales-export-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV EXPORT ERROR:', err);
    }
  };

  const headerSubtitle = useMemo(() => {
    if (isBusy) {
      return 'Loading current sales insights...';
    }

    return `${recordCount.toLocaleString()} record${
      recordCount === 1 ? '' : 's'
    } matching your filters`;
  }, [recordCount, isBusy]);

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-500">
                Retail Sales Hub
              </p>

              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                Sales analytics overview
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {headerSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                <DownloadCloud className="h-4 w-4" />
                Export CSV
              </button>

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
        </div>

        {/* Analytics */}
        <AnalyticsCards
          summary={summary}
          isLoading={isSummaryLoading}
        />

        {/* Main Content */}
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">

          {/* Filters */}
          <aside className="sticky top-28 self-start">
            <FilterPanel />
          </aside>

          {/* Data Section */}
          <section className="space-y-6">

            {/* Charts */}
            <ChartsSection
              charts={charts}
              isLoading={isChartsLoading}
            />

            {/* Loading */}
            {isTableLoading && (
              <LoadingState />
            )}

            {/* Error */}
            {isError && (
              <ErrorState
                message={
                  error?.message ||
                  'Failed to load sales data.'
                }
              />
            )}

            {/* Empty */}
            {!isTableLoading &&
              !isError &&
              sales.length === 0 && (
                <EmptyState />
              )}

            {/* Table */}
            {!isTableLoading &&
              !isError &&
              sales.length > 0 && (
                <>
                  <SalesTable
                    records={sales}
                  />

                  <PaginationControls
                    meta={meta}
                  />
                </>
              )}

          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;