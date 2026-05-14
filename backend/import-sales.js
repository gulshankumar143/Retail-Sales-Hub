const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const JSONStream = require('JSONStream');
const dotenv = require('dotenv');
const Sale = require('./src/models/sale.model');

dotenv.config();

const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

const importSalesData = async () => {
  try {
    await mongoose.connect(mongoUri, { family: 4 });

    const dataPath = path.join(__dirname, 'sales.json');

    // Clear existing data
    await Sale.deleteMany();

    let count = 0;
    const batchSize = 1000; // Process in batches
    let batch = [];

    const stream = fs.createReadStream(dataPath)
      .pipe(JSONStream.parse('*'));

    stream.on('data', async (item) => {
      // Add default values for missing fields
      const saleWithDefaults = {
        ...item,
        date: item.date.$date ? new Date(item.date.$date) : new Date(item.date),
        paymentMethod: item.paymentMethod || 'Credit Card',
        orderStatus: item.orderStatus || 'Completed',
        deliveryType: item.deliveryType || 'Standard',
        storeId: item.storeId || 'STORE-001',
        storeLocation: item.storeLocation || 'Main Store',
        salespersonId: item.salespersonId || 'EMP-001',
        employeeName: item.employeeName || 'John Doe'
      };

      // Remove any MongoDB internal fields that might cause issues
      delete saleWithDefaults._id;
      delete saleWithDefaults.createdAt;
      delete saleWithDefaults.updatedAt;

      batch.push(saleWithDefaults);
      count++;

      if (batch.length >= batchSize) {
        stream.pause();
        try {
          await Sale.insertMany(batch, { timestamps: false });
          console.log(`Imported ${count} records...`);
          batch = [];
          stream.resume();
        } catch (error) {
          console.error('Batch insert failed:', error);
          stream.destroy();
        }
      }
    });

    stream.on('end', async () => {
      try {
        if (batch.length > 0) {
          await Sale.insertMany(batch, { timestamps: false });
          console.log(`Imported remaining ${batch.length} records.`);
        }
        console.log(`Total imported: ${count} sales records into MongoDB.`);
        process.exit(0);
      } catch (error) {
        console.error('Final batch insert failed:', error);
        process.exit(1);
      }
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
};

importSalesData();