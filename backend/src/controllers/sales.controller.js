const asyncHandler = require('../middleware/asyncHandler');
const { getSales, getSalesExport } = require('../services/sales.service');
const { Parser } = require('json2csv');

const fetchSales = asyncHandler(async (req, res) => {
  const result = await getSales(req.query);
  res.json(result);
});

const exportSalesCSV = asyncHandler(async (req, res) => {
  const records = await getSalesExport(req.query);
  const fields = [
    { label: 'Customer ID', value: 'customerId' },
    { label: 'Customer Name', value: 'customerName' },
    { label: 'Phone Number', value: 'phoneNumber' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Region', value: 'customerRegion' },
    { label: 'Customer Type', value: 'customerType' },
    { label: 'Product Name', value: 'productName' },
    { label: 'Brand', value: 'brand' },
    { label: 'Product Category', value: 'productCategory' },
    { label: 'Tags', value: (row) => (row.tags || []).join('; ') },
    { label: 'Quantity', value: 'quantity' },
    { label: 'Price per Unit', value: 'pricePerUnit' },
    { label: 'Discount Percentage', value: 'discountPercentage' },
    { label: 'Total Amount', value: 'totalAmount' },
    { label: 'Final Amount', value: 'finalAmount' },
    { label: 'Date', value: (row) => new Date(row.date).toISOString().slice(0, 10) },
    { label: 'Payment Method', value: 'paymentMethod' },
    { label: 'Order Status', value: 'orderStatus' },
    { label: 'Delivery Type', value: 'deliveryType' },
    { label: 'Store ID', value: 'storeId' },
    { label: 'Store Location', value: 'storeLocation' },
    { label: 'Salesperson ID', value: 'salespersonId' },
    { label: 'Employee Name', value: 'employeeName' }
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(records);
  const fileName = `sales-export-${new Date().toISOString().slice(0, 10)}.csv`;

  res.header('Content-Type', 'text/csv; charset=UTF-8');
  res.attachment(fileName);
  res.send(csv);
});

module.exports = { fetchSales, exportSalesCSV };

