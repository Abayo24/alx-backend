const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 1245;

// Data
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// Redis client
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Data access
const getItemById = (id) => listProducts.find((item) => item.id === id);

// Redis functions
const reserveStockById = async (itemId, stock) => {
  const currentReservedStock = await getCurrentReservedStockById(itemId);
  const newReservedStock = parseInt(currentReservedStock) + stock;
  await setAsync(`item.${itemId}`, newReservedStock);
};

const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock || 0;
};

// Routes
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.json({ status: 'Product not found' });
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);
  const currentAvailableStock = item.stock - currentReservedStock;

  res.json({ ...item, currentQuantity: currentAvailableStock });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.json({ status: 'Product not found' });
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);
  const currentAvailableStock = item.stock - currentReservedStock;

  if (currentAvailableStock === 0) {
    return res.json({ status: 'Not enough stock available', itemId });
  }

  await reserveStockById(itemId, 1);
  res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});