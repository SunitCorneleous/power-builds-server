const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// mongodb config
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db('power-builds').collection('products');

    // get all products
    app.get('/api/products', async (req, res) => {
      const products = await productCollection.find({}).toArray();

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
      });
    });

    // get product by id
    app.get('/api/productById', async (req, res) => {
      const { productId } = req.query;

      if (!productId || !ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }

      const product = await productCollection.findOne({
        _id: new ObjectId(productId),
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
      });
    });

    // get products by category
    app.get('/api/productByCategory', async (req, res) => {
      const { category } = req.query;

      const product = await productCollection
        .find({
          category: category,
        })
        .toArray();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
      });
    });
  } catch (error) {
  } finally {
  }
}

run().catch(error => console.log(error));

// home route
app.get('/api', (req, res) => {
  res.send('<h1>Power Builds server is running</h1>');
});

// run app
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
