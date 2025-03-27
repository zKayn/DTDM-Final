require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Thêm sản phẩm
app.post("/add-product", (req, res) => {
  const { name, price } = req.body;
  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  db.query(sql, [name, price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product added", id: result.insertId });
  });
});

// Tìm kiếm sản phẩm
app.get("/search", (req, res) => {
  const { name } = req.query;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${name}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
