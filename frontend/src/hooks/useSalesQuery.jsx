import { useEffect, useMemo, useState } from 'react';

import api from '../services/api';

import { useQueryContext } from '../context/QueryContext';

const useSalesQuery = () => {
  const { state } = useQueryContext();

const [responseData, setResponseData] = useState({
  data: [],
  meta: {
    currentPage: 1,
    pageSize: 12,
    totalPages: 1,
    totalRecords: 0
  }
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const queryObject = useMemo(() => ({
    ...state,

    region: state.region.join(','),
    gender: state.gender.join(','),
    category: state.category.join(','),
    tags: state.tags.join(','),
    paymentMethod: state.paymentMethod.join(','),

    customerType: state.customerType.join(','),
    orderStatus: state.orderStatus.join(','),
    deliveryType: state.deliveryType.join(',')
  }), [state]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSales = async () => {
      setIsLoading(true);

      setError(null);

      try {
        const response = await api.get('/sales', {
          params: queryObject,
          signal: controller.signal
        });

        setResponseData({
          data: response?.data?.data || [],
          meta:
            response?.data?.meta || {
              currentPage: 1,
              pageSize: 12,
              totalPages: 1,
              totalRecords: 0
            }
        });

      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Sales API Error:', err);

          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchSales();
    }, 300);

    return () => {
      controller.abort();

      clearTimeout(timer);
    };
  }, [queryObject]);

  return {
    ...responseData,
    isLoading,
    isError: !!error,
    error
  };
};

export default useSalesQuery;