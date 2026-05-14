const parseArray = (value) => {
  if (!value) return [];
  return Array.isArray(value)
    ? value.filter(Boolean)
    : String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const buildSalesMatch = (query = {}) => {
  const {
    search,
    region,
    gender,
    customerType,
    category,
    tags,
    paymentMethod,
    orderStatus,
    deliveryType,
    minAge,
    maxAge,
    startDate,
    endDate
  } = query;

  const match = {};

  if (search) {
    const regex = new RegExp(search, 'i');
    match.$or = [
      { customerName: regex },
      { phoneNumber: regex },
      { productName: regex },
      { productCategory: regex },
      { orderStatus: regex },
      { employeeName: regex }
    ];
  }

  if (region) {
    const values = parseArray(region);
    if (values.length) match.customerRegion = { $in: values };
  }

  if (gender) {
    const values = parseArray(gender);
    if (values.length) match.gender = { $in: values };
  }

  if (customerType) {
    const values = parseArray(customerType);
    if (values.length) match.customerType = { $in: values };
  }

  if (category) {
    const values = parseArray(category);
    if (values.length) match.productCategory = { $in: values };
  }

  if (tags) {
    const values = parseArray(tags);
    if (values.length) match.tags = { $in: values };
  }

  if (paymentMethod) {
    const values = parseArray(paymentMethod);
    if (values.length) match.paymentMethod = { $in: values };
  }

  if (orderStatus) {
    const values = parseArray(orderStatus);
    if (values.length) match.orderStatus = { $in: values };
  }

  if (deliveryType) {
    const values = parseArray(deliveryType);
    if (values.length) match.deliveryType = { $in: values };
  }

  if (minAge || maxAge) {
    match.age = {};
    if (minAge) match.age.$gte = Number(minAge);
    if (maxAge) match.age.$lte = Number(maxAge);
    if (Object.keys(match.age).length === 0) delete match.age;
  }

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
    if (Object.keys(match.date).length === 0) delete match.date;
  }

  return match;
};

module.exports = { buildSalesMatch, parseArray };
