const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});
const Product = mongoose.model("Product", productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  items: [{ productId: String, quantity: Number }],
  total: Number,
});
const Order = mongoose.model("Order", orderSchema);

// Routes
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/orders", async (req, res) => {
  const { items } = req.body;

  // Calculate total price
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    total += product.price * item.quantity;
  }

  const order = new Order({ items, total });
  await order.save();
  res.json({ message: "Order placed!", order });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
