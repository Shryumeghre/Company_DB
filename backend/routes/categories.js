const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM category', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;
