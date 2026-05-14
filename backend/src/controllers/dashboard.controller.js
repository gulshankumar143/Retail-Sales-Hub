const asyncHandler = require('../middleware/asyncHandler');
const {
  fetchDashboardSummary,
  fetchDashboardCharts,
  fetchDashboardFilters
} = require('../services/dashboard.service');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await fetchDashboardSummary(req.query);
  res.json({ success: true, data });
});

const getDashboardCharts = asyncHandler(async (req, res) => {
  const data = await fetchDashboardCharts(req.query);
  res.json({ success: true, data });
});

const getDashboardFilters = asyncHandler(async (req, res) => {
  const data = await fetchDashboardFilters(req.query);
  res.json({ success: true, data });
});

module.exports = {
  getDashboardSummary,
  getDashboardCharts,
  getDashboardFilters
};
