const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Kết nối MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        process.exit(1);
    } else {
        console.log('Kết nối MySQL thành công!');
    }
});

// Thêm sản phẩm
app.post('/add-product', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên và giá sản phẩm' });
    }
    const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
    db.query(query, [name, price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Sản phẩm đã được thêm!', id: result.insertId });
    });
});

// Tìm kiếm sản phẩm
app.get('/search-products', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp từ khóa tìm kiếm' });
    }
    const query = 'SELECT * FROM products WHERE name LIKE ?';
    db.query(query, [`%${name}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server đang chạy trên cổng ${port}`);
});
