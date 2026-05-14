const Sale = require('../models/sale.model');
const { buildSalesMatch } = require('../utils/queryBuilder');

const buildSort = (queryParams) => {
  const sortBy = queryParams.sortBy || 'date';
  const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: sortOrder };
};

const getSales = async (queryParams) => {
  const page = Math.max(Number(queryParams.page) || 1, 1);
  const limit = Math.max(Number(queryParams.limit) || 12, 1);
  const matchStage = buildSalesMatch(queryParams);
  const sortStage = buildSort(queryParams);

  const aggregation = [
    { $match: matchStage },
    { $sort: sortStage },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
      }
    }
  ];

  const result = await Sale.aggregate(aggregation);
  const totalRecords = result[0]?.metadata[0]?.total || 0;
  const totalPages = Math.max(Math.ceil(totalRecords / limit), 1);

  return {
    data: result[0]?.data || [],
    meta: {
      totalRecords,
      totalPages,
      currentPage: page,
      pageSize: limit
    }
  };
};

const getSalesExport = async (queryParams) => {
  const matchStage = buildSalesMatch(queryParams);
  const sortStage = buildSort(queryParams);
  return Sale.find(matchStage).sort(sortStage).lean();
};

module.exports = { getSales, getSalesExport };

