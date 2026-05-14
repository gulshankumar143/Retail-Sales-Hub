import { useQuery } from '@tanstack/react-query';
import { useQueryContext } from '../context/QueryContext';
import { fetchDashboardCharts } from '../services/dashboard';

const useDashboardCharts = () => {
  const { state } = useQueryContext();
  return useQuery({
    queryKey: ['dashboard-charts', state],
    queryFn: () => fetchDashboardCharts(state),
    staleTime: 1000 * 60,
    keepPreviousData: true
  });
};

export default useDashboardCharts;
