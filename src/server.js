const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Test Task Backend API' });
});

const itemsRoutes = require('./routes/items');
const logsRoutes = require('./routes/logs');

app.use('/api/items', itemsRoutes);
app.use('/api/logs', logsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/items`);
});