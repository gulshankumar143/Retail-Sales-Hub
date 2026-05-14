const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sale = require('../models/sale.model');

dotenv.config();

const parseTags = (value) => {
  if (!value) return [];
  return String(value)
    .split(/[,;|]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const normalizeRow = (row) => {
  return {
    customerId: row['Customer ID'] || row.customerId || row.customerID || row.customer_id || 'unknown',
    customerName: row['Customer Name'] || row.customerName || row.customer_name || '',
    phoneNumber: row['Phone Number'] || row.phoneNumber || row.phone || '',
    gender: row.Gender || row.gender || 'Other',
    age: Number(row.Age || row.age || 0),
    customerRegion: row['Customer Region'] || row.customerRegion || row.region || 'Unknown',
    customerType: row['Customer Type'] || row.customerType || 'Retail',
    productId: row['Product ID'] || row.productId || '',
    productName: row['Product Name'] || row.productName || '',
    brand: row.Brand || row.brand || '',
    productCategory: row['Product Category'] || row.productCategory || row.category || 'Misc',
    tags: parseTags(row.Tags || row.tags),
    quantity: Number(row.Quantity || row.quantity || 0),
    pricePerUnit: Number(row['Price per Unit'] || row.pricePerUnit || row.price || 0),
    discountPercentage: Number(row['Discount Percentage'] || row.discountPercentage || 0),
    totalAmount: Number(row['Total Amount'] || row.totalAmount || 0),
    finalAmount: Number(row['Final Amount'] || row.finalAmount || 0),
    date: new Date(row.Date || row.date),
    paymentMethod: row['Payment Method'] || row.paymentMethod || 'Unknown',
    orderStatus: row['Order Status'] || row.orderStatus || 'Pending',
    deliveryType: row['Delivery Type'] || row.deliveryType || 'Standard',
    storeId: row['Store ID'] || row.storeId || 'Unknown',
    storeLocation: row['Store Location'] || row.storeLocation || 'Unknown',
    salespersonId: row['Salesperson ID'] || row.salespersonId || 'unknown',
    employeeName: row['Employee Name'] || row.employeeName || 'Unknown'
  };
};

const importCsv = async (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(normalizeRow(row));
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
};

const seedSalesData = async () => {
  const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!mongoUrl) {
    console.error('Missing MongoDB connection URL in MONGODB_URL or MONGODB_URI');
    process.exit(1);
  }

  const csvPath = path.resolve(__dirname, '..', '..', 'sales.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl, { family: 4 });
    const rows = await importCsv(csvPath);
    const uniqueKey = (item) => `${item.customerId}-${item.productId}-${item.date.toISOString()}`;
    const existingKeys = new Set();

    const filtered = [];
    for (const row of rows) {
      const key = uniqueKey(row);
      if (!existingKeys.has(key)) {
        existingKeys.add(key);
        filtered.push(row);
      }
    }

    if (filtered.length === 0) {
      console.log('No records found to seed.');
      process.exit(0);
    }

    await Sale.deleteMany({});
    await Sale.insertMany(filtered);
    console.log(`Seeded ${filtered.length} sales records.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedSalesData();
