const express = require('express');
const {
  getDashboardSummary,
  getDashboardCharts,
  getDashboardFilters
} = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/summary', getDashboardSummary);
router.get('/charts', getDashboardCharts);
router.get('/filters', getDashboardFilters);

module.exports = router;
