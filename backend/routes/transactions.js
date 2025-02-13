const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = `SELECT t.txid, t.product_id, p.title, t.store, t.sales, t.commission, t.status, t.added_at, t.last_updated 
                 FROM transaction t 
                 LEFT JOIN product p ON t.product_id = p.product_id`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;
