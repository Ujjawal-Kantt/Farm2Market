const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authenticate');
const router = express.Router();

//  Get full user details (Authenticated)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await pool.query('SELECT id, first_name, last_name, email, user_type, avatar FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

//  Update user details (Authenticated)
router.put('/update-user', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, avatar } = req.body;
        await pool.query(
            'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), avatar = COALESCE($3, avatar) WHERE id = $4',
            [first_name, last_name, avatar, userId]
        );
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// To get all products of the logged-in user
router.get("/products", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query("SELECT * FROM products WHERE user_id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No products found for this user." });
        }

        res.json({ products: result.rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// To get total products, total sales, and total earnings of a farmer
router.get("/farmer/stats", authMiddleware, async (req, res) => {
    const farmerId = req.user.id; // Extracted from JWT

    try {
        // Check if the user is a farmer
        const userCheck = await pool.query("SELECT user_type FROM users WHERE id = $1", [farmerId]);
        if (userCheck.rows.length === 0 || userCheck.rows[0].user_type !== "farmer") {
            return res.status(403).json({ message: "Access Denied: Only farmers can access this data" });
        }

        // Query to get total number of products listed by the farmer
        const productCountResult = await pool.query("SELECT COUNT(*) FROM products WHERE user_id = $1", [farmerId]);
        const totalProducts = parseInt(productCountResult.rows[0].count) || 0;

        // Query to get total sales (items sold) and total earnings
        const salesResult = await pool.query(`
        SELECT 
          COALESCE(SUM(quantity), 0) AS total_sales,
          COALESCE(SUM(total_price), 0) AS total_earnings
        FROM order_items
        WHERE farmer_id = $1
      `, [farmerId]);

        const totalSales = parseInt(salesResult.rows[0].total_sales) || 0;
        const totalEarnings = parseFloat(salesResult.rows[0].total_earnings) || 0;

        res.json({
            total_products: totalProducts,
            total_sales: totalSales,
            total_earnings: totalEarnings
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
