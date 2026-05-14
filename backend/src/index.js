const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const salesRoute = require('./routes/sales.routes');
const dashboardRoute = require('./routes/dashboard.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use('/api/sales', salesRoute);
app.use('/api/dashboard', dashboardRoute);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Running Successfully',
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

