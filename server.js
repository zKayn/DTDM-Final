const express = require("express");
const mysql = require("mysql2/promise"); // Dùng mysql2/promise
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Để server đọc JSON từ body

// Tạo pool kết nối đến MySQL
const pool = mysql.createPool({
  host: "bnazlrnsly8w9uqixvlr-mysql.services.clever-cloud.com",
  user: "us47gunrvc0yzsry",
  password: "MPZPSJBlUoFvjDrOzuT6",
  database: "bnazlrnsly8w9uqixvlr",
  waitForConnections: true,
  connectionLimit: 10, // Số kết nối tối đa
  queueLimit: 0
});

// Kiểm tra kết nối MySQL
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Đã kết nối với MySQL");
    connection.release();
  } catch (err) {
    console.error("Kết nối cơ sở dữ liệu không thành công:", err.message);
  }
})();

// Route lấy danh sách sản phẩm
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route thêm sản phẩm
app.post("/products/add", async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Thiếu tên hoặc giá" });
  }

  try {
    const [result] = await pool.execute("INSERT INTO products (name, price) VALUES (?, ?)", [name, price]);
    res.status(201).json({ message: "Sản phẩm được thêm thành công!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Cập nhật sản phẩm
app.put("/update-product/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const sql = "UPDATE products SET name = ?, price = ? WHERE id = ?";
  db.query(sql, [name, price, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Sản phẩm đã được cập nhật" });
  });
});


// Route kiểm tra server có chạy không
app.get("/", (req, res) => {
  res.send("Máy chủ đang chạy...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Máy chủ chạy trên cổng ${PORT}`);
});
