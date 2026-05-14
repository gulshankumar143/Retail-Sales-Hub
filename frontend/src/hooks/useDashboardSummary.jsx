import { useQuery } from '@tanstack/react-query';
import { useQueryContext } from '../context/QueryContext';
import { fetchDashboardSummary } from '../services/dashboard';

const useDashboardSummary = () => {
  const { state } = useQueryContext();

  return useQuery({
    queryKey: ['dashboard-summary', state],

    queryFn: () => fetchDashboardSummary(state),

    staleTime: 1000 * 60,

    placeholderData: (previousData) => previousData,
  });
};

export default useDashboardSummary;