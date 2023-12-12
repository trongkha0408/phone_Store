// controllers/reportController.js

const Customer = require('../models/Customers');

const viewReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {
      'purchaseHistory.orderDate': { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const result = await Customer.find(query)
      .select('fullName phoneNumber purchaseHistory.totalAmount purchaseHistory.orderDate purchaseHistory.profit')
      .sort('purchaseHistory.orderDate');

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { viewReport };
