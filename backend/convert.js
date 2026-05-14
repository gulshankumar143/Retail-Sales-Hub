const fs = require('fs');
const csv = require('csv-parser');

const output = fs.createWriteStream('sales.json');

output.write('[\n');

let isFirstRow = true;

fs.createReadStream('sales.csv')
  .pipe(csv())

  .on('data', (data) => {
    const parsedDate = new Date(data['Date']);

    const document = {
      customerId: data['Customer ID'],
      customerName: data['Customer Name'],
      phoneNumber: data['Phone Number'],

      gender: data['Gender'],
      age: Number(data['Age']),

      customerRegion: data['Customer Region'],
      customerType: data['Customer Type'],

      productId: data['Product ID'],
      productName: data['Product Name'],
      brand: data['Brand'],
      productCategory: data['Product Category'],

      tags: data['Tags']
        ? data['Tags']
            .split(',')
            .map((tag) => tag.trim())
        : [],

      quantity: Number(data['Quantity']),
      pricePerUnit: Number(data['Price per Unit']),
      discountPercentage: Number(data['Discount Percentage']),

      totalAmount: Number(data['Total Amount']),
      finalAmount: Number(data['Final Amount']),

      date: {
        $date: isNaN(parsedDate.getTime())
          ? new Date().toISOString()
          : parsedDate.toISOString()
      },

      paymentMethod: data['Payment Method'],
      orderStatus: data['Order Status'],
      deliveryType: data['Delivery Type'],

      storeId: data['Store ID'],
      storeLocation: data['Store Location'],

      salespersonId: data['Salesperson ID'],
      employeeName: data['Employee Name'],

      createdAt: {
        $date: new Date().toISOString()
      },

      updatedAt: {
        $date: new Date().toISOString()
      }
    };

    if (!isFirstRow) {
      output.write(',\n');
    }

    output.write(JSON.stringify(document, null, 2));

    isFirstRow = false;
  })

  .on('end', () => {
    output.write('\n]');
    output.end();

    console.log('sales.json generated successfully');
  })

  .on('error', (error) => {
    console.error('CSV Parsing Error:', error);
  });