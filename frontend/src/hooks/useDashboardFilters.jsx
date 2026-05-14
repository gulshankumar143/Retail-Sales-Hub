import { useQuery } from '@tanstack/react-query';
import { fetchDashboardFilters } from '../services/dashboard';

const useDashboardFilters = () => {
  return useQuery({
    queryKey: ['dashboard-filters'],
    queryFn: fetchDashboardFilters,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
};

export default useDashboardFilters;
