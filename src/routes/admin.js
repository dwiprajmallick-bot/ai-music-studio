const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_PATH = path.join(__dirname, "../../data/users.json");
const ORDERS_PATH = path.join(__dirname, "../../data/orders.json");

if (!fs.existsSync(ORDERS_PATH)) {
    fs.writeFileSync(ORDERS_PATH, JSON.stringify([
        { id: "ORD_781", email: "user1@demo.com", plan: "Starter (50 Credits)", amount: 399, currency: "INR", status: "SUCCESS", date: "2026-10-02" },
        { id: "ORD_782", email: "creator99@gmail.com", plan: "Creator Unlimited", amount: 1199, currency: "INR", status: "SUCCESS", date: "2026-10-03" }
    ], null, 2), "utf8");
}

function getData(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        return filePath.endsWith("users.json") ? {} : [];
    }
}

// এডমিন ওভারভিউ মেট্রিক্স
router.get("/metrics", (req, res) => {
    try {
        const users = getData(USERS_PATH);
        const orders = getData(ORDERS_PATH);
        
        const totalUsers = Object.keys(users).length || 12; // Initial seed count
        const totalRevenue = orders.reduce((sum, o) => sum + (o.status === "SUCCESS" ? o.amount : 0), 0);
        
        res.json({
            success: true,
            totalUsers,
            totalOrders: orders.length,
            totalRevenue,
            currency: "₹",
            recentOrders: orders.reverse().slice(0, 10),
            usersList: Object.values(users)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
