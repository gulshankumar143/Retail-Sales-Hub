const Sale = require('../models/sale.model');
const { buildSalesMatch } = require('../utils/queryBuilder');

const allowedSortFields = [
  'date',
  'finalAmount',
  'quantity',
  'customerName',
  'customerRegion',
  'productCategory'
];

const buildSort = (queryParams = {}) => {
  const requestedSort = queryParams.sortBy || 'date';

  const sortBy = allowedSortFields.includes(requestedSort)
    ? requestedSort
    : 'date';

  const sortOrder =
    queryParams.sortOrder === 'asc' ? 1 : -1;

  return {
    [sortBy]: sortOrder
  };
};

const getSales = async (queryParams = {}) => {
  try {
    const page = Math.max(Number(queryParams.page) || 1, 1);

    const limit = Math.max(Number(queryParams.limit) || 12, 1);

    const skip = (page - 1) * limit;

    const matchStage = buildSalesMatch(queryParams);

    const sortStage = buildSort(queryParams);

    const aggregation = [
      {
        $match: matchStage
      },

      {
        $sort: sortStage
      },

      {
        $facet: {
          metadata: [
            {
              $count: 'total'
            }
          ],

          data: [
            {
              $skip: skip
            },

            {
              $limit: limit
            }
          ]
        }
      }
    ];

    const result = await Sale.aggregate(aggregation);

    const metadata = result?.[0]?.metadata || [];

    const salesData = result?.[0]?.data || [];

    const totalRecords = metadata?.[0]?.total || 0;

    const totalPages = Math.max(
      Math.ceil(totalRecords / limit),
      1
    );

    return {
      data: Array.isArray(salesData)
        ? salesData
        : [],

      meta: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    };
  } catch (error) {
    console.error('GET SALES SERVICE ERROR:', error);

    return {
      data: [],

      meta: {
        totalRecords: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: 12
      }
    };
  }
};

const getSalesExport = async (queryParams = {}) => {
  try {
    const matchStage = buildSalesMatch(queryParams);

    const sortStage = buildSort(queryParams);

    const records = await Sale.find(matchStage)
      .sort(sortStage)
      .lean();

    return Array.isArray(records)
      ? records
      : [];
  } catch (error) {
    console.error('GET SALES EXPORT ERROR:', error);

    return [];
  }
};

module.exports = {
  getSales,
  getSalesExport
};