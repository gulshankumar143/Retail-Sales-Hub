import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#fb7185'];

const chartItems = [
  {
    title: 'Revenue Trend',
    description: 'Last 12 months revenue movement',
    type: 'line',
    dataKey: 'revenue',
    series: 'revenueTrend',
    xAxisKey: 'label'
  },
  {
    title: 'Monthly Orders',
    description: 'Orders placed by month',
    type: 'area',
    dataKey: 'orders',
    series: 'monthlyOrders',
    xAxisKey: 'label'
  },
  {
    title: 'Sales by Region',
    description: 'Top performing regions',
    type: 'bar',
    dataKey: 'value',
    series: 'salesByRegion'
  },
  {
    title: 'Product Category Mix',
    description: 'Category share of total sales',
    type: 'bar',
    dataKey: 'value',
    series: 'categoryDistribution'
  },
  {
    title: 'Payment Methods',
    description: 'How customers pay',
    type: 'pie',
    dataKey: 'value',
    series: 'paymentMethod'
  }
];

const renderChart = (item, data) => {
  if (!data) {
    return <div className="h-72 grid place-items-center text-sm text-slate-500">No chart data available</div>;
  }

  const chartData = data[item.series] || [];

  switch (item.type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={item.xAxisKey || 'month'} tick={{ fill: '#64748b' }} />
            <YAxis tick={{ fill: '#64748b' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={item.dataKey} stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={item.xAxisKey || 'month'} tick={{ fill: '#64748b' }} />
            <YAxis tick={{ fill: '#64748b' }} />
            <Tooltip />
            <Area type="monotone" dataKey={item.dataKey} stroke="#10b981" fill="#a7f3d0" fillOpacity={0.65} />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#64748b' }} />            <YAxis tick={{ fill: '#64748b' }} />
            <Tooltip />
            <Bar dataKey={item.dataKey} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={chartData} dataKey={item.dataKey} nameKey="name" cx="50%" cy="48%" outerRadius={100} fill="#38bdf8" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};

const ChartsSection = ({ charts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {chartItems.map((item) => (
        <section key={item.title} className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </div>
          </div>
          {renderChart(item, charts)}
        </section>
      ))}
    </div>
  );
};

export default ChartsSection;
