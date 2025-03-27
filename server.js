const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Để server đọc JSON từ body

const db = mysql.createConnection({
  host: "bnazlrnsly8w9uqixvlr-mysql.services.clever-cloud.com",
  user: "us47gunrvc0yzsry",
  password: "MPZPSJBlUoFvjDrOzuT6",
  database: "bnazlrnsly8w9uqixvlr"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

// ✅ Route thêm sản phẩm
app.post("/products/add", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Missing name or price" });
  }

  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  db.query(sql, [name, price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Product added successfully!", id: result.insertId });
  });
});

// ✅ Route kiểm tra server có chạy không
app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/products", async (req, res) => {
  try {
      const [rows] = await db.execute("SELECT * FROM products");
      res.json(rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
