import { useMemo, useState } from 'react';
import { BarChart3, FileText } from 'lucide-react';
import AnalyticsCards from '../components/AnalyticsCards';
import ChartsSection from '../components/ChartsSection';
import useDashboardSummary from '../hooks/useDashboardSummary';
import useDashboardCharts from '../hooks/useDashboardCharts';
import useDashboardFilters from '../hooks/useDashboardFilters';
import MainLayout from '../layouts/MainLayout';

const Reports = () => {
  const summaryQuery = useDashboardSummary();
  const chartsQuery = useDashboardCharts();
  const filtersQuery = useDashboardFilters();
  const [showInsights, setShowInsights] = useState(false);

  const isBusy = summaryQuery.isLoading || chartsQuery.isLoading || filtersQuery.isLoading;

  const reportSubtitle = useMemo(() => {
    if (isBusy) return 'Gathering insights and reports...';
    return 'Automated sales reports and performance summaries for your retail business.';
  }, [isBusy]);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-500">Reports</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Performance reports</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{reportSubtitle}</p>
            </div>
            <button
              onClick={() => setShowInsights(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" />
              Report insights
            </button>
          </div>
        </div>

        <AnalyticsCards
          summary={summaryQuery?.data || {}}
          isLoading={summaryQuery?.isLoading}
        />

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="rounded-3xl bg-indigo-500/10 p-4 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Sales performance trends</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your top categories and customer segments over time.</p>
              </div>
            </div>
          </div>

          <ChartsSection
            charts={chartsQuery?.data || {}}
            isLoading={chartsQuery?.isLoading}
          />
        </div>
      </div>
      {showInsights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Retail Insights Report
              </h2>

              <button
                onClick={() => setShowInsights(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Revenue Performance
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Revenue has shown strong growth with increasing customer retention
                  and higher average order value across major product categories.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Customer Analytics
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Returning customers contribute significantly to sales performance,
                  especially in beauty and electronics categories.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Product Trends
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Product demand remains highest in high-margin categories with
                  consistent regional growth patterns.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Reports;
