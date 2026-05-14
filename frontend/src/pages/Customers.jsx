import { useMemo } from 'react';
import { Users } from 'lucide-react';

import useSalesQuery from '../hooks/useSalesQuery';
import MainLayout from '../layouts/MainLayout';

const Customers = () => {
  const {
    data: sales = [],
    isLoading,
    isError,
    error
  } = useSalesQuery();

  const customers = useMemo(() => {
    const map = new Map();

    (sales || []).forEach((sale) => {
      const id = sale.customerId || sale.customerName;

      if (!id) return;

      const existing = map.get(id) || {
        customerId: sale.customerId || 'Unknown',
        customerName: sale.customerName || 'Unknown Customer',
        phoneNumber: sale.phoneNumber || 'N/A',
        gender: sale.gender || 'N/A',
        region: sale.customerRegion || 'N/A',
        customerType: sale.customerType || 'N/A',
        totalOrders: 0,
        totalSpent: 0
      };

      existing.totalOrders += 1;

      existing.totalSpent += Number(sale.finalAmount || 0);

      map.set(id, existing);
    });

    return Array.from(map.values());
  }, [sales]);

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-500">
                Customers
              </p>

              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                Customer insights
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Explore customer behavior from the current sales data.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Users className="h-4 w-4" />

              {customers.length.toLocaleString()} unique customers
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 text-slate-500 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80 dark:text-slate-300">
            Loading customer insights...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-3xl border border-rose-200/70 bg-rose-50/80 p-8 text-rose-700 shadow-xl dark:border-rose-800/70 dark:bg-rose-950/10 dark:text-rose-200">
            <p className="font-semibold">
              Unable to load customer data.
            </p>

            <p className="mt-2 text-sm">
              {error?.message || 'Something went wrong while fetching customers.'}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && customers.length === 0 && (
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 text-slate-500 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80 dark:text-slate-300">
            No customer data available for the current filters.
          </div>
        )}

        {/* Customer Cards */}
        {!isLoading && !isError && customers.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {customers.slice(0, 12).map((customer) => (
              <div
                key={customer.customerId}
                className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl transition hover:shadow-2xl dark:border-slate-800/70 dark:bg-slate-950/80"
              >
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                      {customer.customerId}
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                      {customer.customerName}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {customer.phoneNumber}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Orders
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                      {customer.totalOrders}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Total Spent
                    </p>

                    <p className="mt-2 text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                      ${customer.totalSpent.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Region
                    </p>

                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {customer.region}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Customer Type
                    </p>

                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {customer.customerType}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Customers;