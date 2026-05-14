const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true, index: true },
  phoneNumber: { type: String, required: true, index: true },
  gender: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Other'], required: true },
  age: { type: Number, required: true, min: 0 },
  customerRegion: { type: String, required: true },
  customerType: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  productCategory: { type: String, required: true },
  tags: [{ type: String }],
  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true, min: 0 },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
  totalAmount: { type: Number, required: true, min: 0 },
  finalAmount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  orderStatus: { type: String, required: true },
  deliveryType: { type: String, required: true },
  storeId: { type: String, required: true },
  storeLocation: { type: String, required: true },
  salespersonId: { type: String, required: true },
  employeeName: { type: String, required: true }
}, {
  timestamps: true,
});

SaleSchema.index({ customerName: 'text', phoneNumber: 'text' });
SaleSchema.index({ customerRegion: 1, productCategory: 1, paymentMethod: 1, date: 1 });

module.exports = mongoose.model('Sale', SaleSchema);
