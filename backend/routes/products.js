const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
// 2*20-20+1 = 21+20-1
// 3*20-20+1 = 41+20-1
    const page = parseInt(req.query.page) || 1; //if no page no. is entered by user then default pg no. will be 1
    const limit = 20;  //As told in interview I have put limit of 20
    const offset = (page-1)*limit;  
    const sql = `SELECT p.product_id, p.title, p.category_id, c.category_name, p.price 
                 FROM product p 
                 LEFT JOIN category c ON p.category_id = c.category_id LIMIT ? OFFSET ?`;  
    db.query(sql, [limit, offset],(err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({page, limit, data:result});
    });
});

module.exports = router;
