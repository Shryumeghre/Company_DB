const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = `SELECT p.product_id, p.title, p.category_id, c.category_name, p.price 
                 FROM product p 
                 LEFT JOIN category c ON p.category_id = c.category_id`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;
