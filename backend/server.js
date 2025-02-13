const express = require('express');
const cors = require('cors');
const db = require('./db');
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const transactionsRoutes = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/transactions', transactionsRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
