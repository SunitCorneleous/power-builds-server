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

    app.get('/api/products', async (req, res) => {
      const products = await productCollection.find({}).toArray();

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: products,
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
