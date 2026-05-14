import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const SalesTable = ({ records }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Customer Name',
        accessorKey: 'customerName',
        cell: (info) => <span className="font-medium text-slate-900 dark:text-white">{info.getValue()}</span>
      },
      {
        header: 'Phone Number',
        accessorKey: 'phoneNumber',
        cell: (info) => <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">{info.getValue()}</span>
      },
      {
        header: 'Region',
        accessorKey: 'customerRegion',
        cell: (info) => <span className="text-slate-700 dark:text-slate-200">{info.getValue()}</span>
      },
      {
        header: 'Product',
        accessorKey: 'productName',
        cell: (info) => <span className="text-slate-700 dark:text-slate-200">{info.getValue()}</span>
      },
      {
        header: 'Category',
        accessorKey: 'productCategory',
        cell: (info) => (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{info.getValue()}</span>
        )
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: (info) => <span className="text-slate-900 dark:text-white font-semibold">{info.getValue()}</span>
      },
      {
        header: 'Final Amount',
        accessorKey: 'finalAmount',
        cell: (info) => (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">${info.getValue().toFixed(2)}</span>
        )
      },
      {
        header: 'Payment Method',
        accessorKey: 'paymentMethod',
        cell: (info) => (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">{info.getValue()}</span>
        )
      },
      {
        header: 'Order Status',
        accessorKey: 'orderStatus',
        cell: (info) => (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{info.getValue()}</span>
        )
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (info) => (
          <span className="text-slate-600 dark:text-slate-400 text-sm">{new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        )
      }
    ],
    []
  );

  const table = useReactTable({ data: records, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden"
    >
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <table className="min-w-[1400px] divide-y divide-slate-200/60 dark:divide-slate-800/60">          
        <thead className="bg-slate-50 dark:bg-slate-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 bg-white dark:bg-slate-950">
            {table.getRowModel().rows.map((row, idx) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 align-top text-sm text-slate-700 dark:text-slate-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SalesTable;
