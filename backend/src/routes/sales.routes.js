const express = require('express');
const { fetchSales, exportSalesCSV } = require('../controllers/sales.controller');

const router = express.Router();
router.get('/', fetchSales);
router.get('/export', exportSalesCSV);

module.exports = router;
