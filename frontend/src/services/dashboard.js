import api from './api';

const normalizeState = (state) => ({
  ...state,
  region: state.region?.join(',') || '',
  gender: state.gender?.join(',') || '',
  customerType: state.customerType?.join(',') || '',
  category: state.category?.join(',') || '',
  tags: state.tags?.join(',') || '',
  paymentMethod: state.paymentMethod?.join(',') || '',
  orderStatus: state.orderStatus?.join(',') || '',
  deliveryType: state.deliveryType?.join(',') || ''
});

export const fetchSales = async (query) => {
  const params = normalizeState(query);
  const response = await api.get('/sales', { params });
  return response.data;
};

export const fetchDashboardSummary = async (query) => {
  const params = normalizeState(query);
  const response = await api.get('/dashboard/summary', { params });
  return response.data.data;
};

export const fetchDashboardCharts = async (query) => {
  const params = normalizeState(query);
  const response = await api.get('/dashboard/charts', { params });
  return response.data.data;
};

export const fetchDashboardFilters = async () => {
  const response = await api.get('/dashboard/filters');
  return response.data.data;
};

export const exportSalesCsv = async (query) => {
  const params = normalizeState(query);
  const response = await api.get('/sales/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
};
