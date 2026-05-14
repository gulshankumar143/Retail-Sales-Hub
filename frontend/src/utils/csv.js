const wrapValue = (value) => {
  if (value === null || value === undefined) return '';
  const output = typeof value === 'object' ? JSON.stringify(value) : String(value);
  const escaped = output.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const exportToCSV = (rows, filename = 'sales-export.csv') => {
  if (!rows || rows.length === 0) return;

  const headers = [
    'Customer Name',
    'Phone Number',
    'Product Category',
    'Quantity',
    'Final Amount',
    'Payment Method',
    'Date',
    'Employee Name'
  ];

  const csvRows = [headers.join(',')];

  rows.forEach((row) => {
    const record = [
      wrapValue(row.customerName),
      wrapValue(row.phoneNumber),
      wrapValue(row.productCategory),
      wrapValue(row.quantity),
      wrapValue(row.finalAmount?.toFixed?.(2) ?? row.finalAmount),
      wrapValue(row.paymentMethod),
      wrapValue(new Date(row.date).toLocaleDateString()),
      wrapValue(row.employeeName)
    ];
    csvRows.push(record.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
