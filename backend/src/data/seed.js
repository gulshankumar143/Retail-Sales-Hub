const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sale = require('../models/sale.model');

dotenv.config();

const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(mongoUri, { family: 4 });
    const dataPath = path.join(__dirname, 'sample-sales.json');
    const sales = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await Sale.deleteMany();
    await Sale.insertMany(sales.map((item) => ({
      ...item,
      date: new Date(item.date)
    })));

    console.log(`Seeded ${sales.length} sales records.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
