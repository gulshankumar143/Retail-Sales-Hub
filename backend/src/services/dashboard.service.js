const Sale = require('../models/sale.model');
const { buildSalesMatch } = require('../utils/queryBuilder');

const buildSort = (queryParams) => {
  const sortBy = queryParams.sortBy || 'date';
  const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: sortOrder };
};

const formatMonthLabels = (rows) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return rows.map((row) => ({
    label: `${monthNames[row._id.month - 1]} ${row._id.year}`,
    revenue: row.revenue,
    orders: row.orders,
    month: row._id.month,
    year: row._id.year
  }));
};

const fetchDashboardSummary = async (queryParams) => {
  const match = buildSalesMatch(queryParams);

  const result = await Sale.aggregate([
    { $match: match },
    {
      $facet: {
        metrics: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$finalAmount' },
              totalOrders: { $sum: 1 },
              totalCustomers: { $addToSet: '$customerId' },
              productsSold: { $sum: '$quantity' },
              avgOrderValue: { $avg: '$finalAmount' },
              convertedOrders: {
                $sum: {
                  $cond: [
                    {
                      $in: [
                        { $toLower: '$orderStatus' },
                        ['completed', 'delivered', 'paid', 'fulfilled']
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              totalRevenue: 1,
              totalOrders: 1,
              totalCustomers: { $size: '$totalCustomers' },
              productsSold: 1,
              avgOrderValue: { $round: ['$avgOrderValue', 2] },
              conversionRate: {
                $cond: [
                  { $gt: ['$totalOrders', 0] },
                  { $multiply: [{ $divide: ['$convertedOrders', '$totalOrders'] }, 100] },
                  0
                ]
              }
            }
          }
        ],
        topRegion: [
          {
            $group: {
              _id: '$customerRegion',
              revenue: { $sum: '$finalAmount' }
            }
          },
          { $sort: { revenue: -1 } },
          { $limit: 1 }
        ],
        monthlyRevenue: [
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' }
              },
              revenue: { $sum: '$finalAmount' }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 2 }
        ]
      }
    }
  ]);

  const summary = result[0]?.metrics[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    productsSold: 0,
    avgOrderValue: 0,
    conversionRate: 0
  };

  const topRegion = result[0].topRegion[0] || { _id: 'N/A', revenue: 0 };
  const monthlyRevenueRows = result[0].monthlyRevenue || [];
  const currentMonthRevenue = monthlyRevenueRows[0]?.revenue || 0;
  const previousMonthRevenue = monthlyRevenueRows[1]?.revenue || 0;
  const monthlyRevenueGrowth = previousMonthRevenue
    ? Number((((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1))
    : 0;

  return {
    ...summary,
    topRegion: topRegion._id || 'N/A',
    monthlyRevenueGrowth
  };
};

const fetchDashboardCharts = async (queryParams) => {
  const match = buildSalesMatch(queryParams);

  const data = await Sale.aggregate([
    { $match: match },
    {
      $facet: {
        revenueTrend: [
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' }
              },
              revenue: { $sum: '$finalAmount' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ],
        salesByRegion: [
          {
            $group: {
              _id: '$customerRegion',
              revenue: { $sum: '$finalAmount' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { revenue: -1 } },
          { $limit: 8 }
        ],
        paymentMethod: [
          {
            $group: {
              _id: '$paymentMethod',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        categoryDistribution: [
          {
            $group: {
              _id: '$productCategory',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        monthlyOrders: [
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' }
              },
              orders: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ],
        topProducts: [
          {
            $group: {
              _id: '$productName',
              unitsSold: { $sum: '$quantity' },
              revenue: { $sum: '$finalAmount' }
            }
          },
          { $sort: { unitsSold: -1 } },
          { $limit: 8 }
        ],
        genderDemographics: [
          {
            $group: {
              _id: '$gender',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        customerTypeAnalytics: [
          {
            $group: {
              _id: '$customerType',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);

  const result = data[0] || {};

  return {
    revenueTrend: formatMonthLabels(result.revenueTrend || []),
    salesByRegion: result.salesByRegion.map((item) => ({ name: item._id, value: item.revenue })),
    paymentMethod: result.paymentMethod.map((item) => ({ name: item._id, value: item.count })),
    categoryDistribution: result.categoryDistribution.map((item) => ({ name: item._id, value: item.count })),
    monthlyOrders: formatMonthLabels(result.monthlyOrders || []).map((item) => ({ label: item.label, orders: item.orders })),
    topProducts: result.topProducts.map((item) => ({ name: item._id, unitsSold: item.unitsSold, revenue: item.revenue })),
    genderDemographics: result.genderDemographics.map((item) => ({ name: item._id, value: item.count })),
    customerTypeAnalytics: result.customerTypeAnalytics.map((item) => ({ name: item._id, value: item.count }))
  };
};

const fetchDashboardFilters = async (queryParams) => {
  const match = buildSalesMatch(queryParams);
  const filteredMatch = Object.keys(match).length ? match : {};

  const [regions, genders, customerTypes, categories, paymentMethods, orderStatuses, deliveryTypes, tagRows, ageRange] = await Promise.all([
    Sale.distinct('customerRegion', filteredMatch),
    Sale.distinct('gender', filteredMatch),
    Sale.distinct('customerType', filteredMatch),
    Sale.distinct('productCategory', filteredMatch),
    Sale.distinct('paymentMethod', filteredMatch),
    Sale.distinct('orderStatus', filteredMatch),
    Sale.distinct('deliveryType', filteredMatch),
    Sale.aggregate([
      { $match: filteredMatch },
      { $unwind: '$tags' },
      { $group: { _id: '$tags' } },
      { $sort: { _id: 1 } }
    ]),
    Sale.aggregate([
      { $match: filteredMatch },
      { $group: { _id: null, minAge: { $min: '$age' }, maxAge: { $max: '$age' } } }
    ])
  ]);

  return {
    region: regions.filter(Boolean).sort(),

    gender: genders.filter(Boolean).sort(),

    customerType: customerTypes.filter(Boolean).sort(),

    category: categories.filter(Boolean).sort(),

    paymentMethod: paymentMethods.filter(Boolean).sort(),

    orderStatus: orderStatuses.filter(Boolean).sort(),

    deliveryType: deliveryTypes.filter(Boolean).sort(),

    tags: tagRows
      .map((row) => row._id)
      .filter(Boolean)
      .sort(),

    ageRange: ageRange[0] || {
      minAge: 0,
      maxAge: 0
    }
  };
};

module.exports = {
  fetchDashboardSummary,
  fetchDashboardCharts,
  fetchDashboardFilters
};
