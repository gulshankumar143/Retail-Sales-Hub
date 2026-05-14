const asyncHandler = require('../middleware/asyncHandler');
const { getSales, getSalesExport } = require('../services/sales.service');
const { Parser } = require('json2csv');

const fetchSales = asyncHandler(async (req, res) => {
  try {
    const result = await getSales(req.query);

    res.status(200).json({
      success: true,
      data: Array.isArray(result?.data) ? result.data : [],
      meta: result?.meta || {
        currentPage: 1,
        pageSize: 12,
        totalPages: 1,
        totalRecords: 0
      }
    });
  } catch (error) {
    console.error('FETCH SALES ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sales data'
    });
  }
});

const exportSalesCSV = asyncHandler(async (req, res) => {
  try {
    const records = await getSalesExport(req.query);

    const safeRecords = Array.isArray(records) ? records : [];

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

      {
        label: 'Tags',
        value: (row) => Array.isArray(row.tags)
          ? row.tags.join('; ')
          : ''
      },

      { label: 'Quantity', value: 'quantity' },
      { label: 'Price per Unit', value: 'pricePerUnit' },
      { label: 'Discount Percentage', value: 'discountPercentage' },
      { label: 'Total Amount', value: 'totalAmount' },
      { label: 'Final Amount', value: 'finalAmount' },

      {
        label: 'Date',
        value: (row) =>
          row.date
            ? new Date(row.date)
                .toISOString()
                .slice(0, 10)
            : ''
      },

      { label: 'Payment Method', value: 'paymentMethod' },
      { label: 'Order Status', value: 'orderStatus' },
      { label: 'Delivery Type', value: 'deliveryType' },
      { label: 'Store ID', value: 'storeId' },
      { label: 'Store Location', value: 'storeLocation' },
      { label: 'Salesperson ID', value: 'salespersonId' },
      { label: 'Employee Name', value: 'employeeName' }
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(safeRecords);

    const fileName = `sales-export-${
      new Date().toISOString().slice(0, 10)
    }.csv`;

    res.header('Content-Type', 'text/csv; charset=UTF-8');

    res.attachment(fileName);

    res.status(200).send(csv);
  } catch (error) {
    console.error('EXPORT SALES CSV ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to export CSV'
    });
  }
});

module.exports = {
  fetchSales,
  exportSalesCSV
};