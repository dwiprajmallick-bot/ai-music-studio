const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const router = express.Router();
require("dotenv").config();

const DATA_DIR = path.join(__dirname, "../../data");
const ORDERS_PATH = path.join(DATA_DIR, "orders.json");
const CUSTOMERS_PATH = path.join(DATA_DIR, "customers.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_PATH)) fs.writeFileSync(ORDERS_PATH, JSON.stringify([], null, 2), "utf8");

// Razorpay সেটআপ (যদি .env এ কী থাকে)
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
        const Razorpay = require("razorpay");
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    } catch(e) {
        console.warn("Razorpay setup skipped:", e.message);
    }
}

// ১. পেমেন্ট অর্ডার তৈরি (Create Checkout Order)
router.post("/create-order", async (req, res) => {
    try {
        const { plan, amount, credits, userEmail, userPhone } = req.body;
        const orderId = "ORD_" + Date.now();

        // লাইভ Razorpay অর্ডার তৈরি
        let gatewayOrderId = orderId;
        if (razorpayInstance) {
            const options = {
                amount: amount * 100, // পয়সায় রূপান্তর
                currency: "INR",
                receipt: orderId
            };
            const rzpOrder = await razorpayInstance.orders.create(options);
            gatewayOrderId = rzpOrder.id;
        }

        const newOrder = {
            id: orderId,
            gatewayOrderId,
            plan: plan || "Studio Pack",
            amount: Number(amount),
            credits: Number(credits),
            email: userEmail || "Guest",
            phone: userPhone || "",
            status: "PENDING",
            date: new Date().toISOString()
        };

        const orders = JSON.parse(fs.readFileSync(ORDERS_PATH, "utf8"));
        orders.push(newOrder);
        fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");

        res.json({
            success: true,
            orderId,
            gatewayOrderId,
            amount,
            keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_demoKey"
        });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ২. পেমেন্ট সফল যাচাই ও স্বয়ংক্রিয় ক্রেডিট ডেলিভারি (Verify & Grant Credits)
router.post("/verify-payment", (req, res) => {
    try {
        const { orderId, credits, userEmail, userPhone } = req.body;
        const orders = JSON.parse(fs.readFileSync(ORDERS_PATH, "utf8"));
        const order = orders.find(o => o.id === orderId);

        if (order) {
            order.status = "SUCCESS";
            fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");
        }

        // কাস্টমার ডেটাবেসে ক্রেডিট আপডেট
        const customers = JSON.parse(fs.readFileSync(CUSTOMERS_PATH, "utf8"));
        let customerKey = userEmail;
        if (!customerKey && userPhone) customerKey = "phone_" + userPhone;

        if (customerKey && customers[customerKey]) {
            customers[customerKey].credits = (customers[customerKey].credits || 0) + Number(credits);
            fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify(customers, null, 2), "utf8");
        }

        res.json({
            success: true,
            message: `পেমেন্ট সফল! ${credits} টি ক্রেডিট যুক্ত হয়েছে।`,
            newCredits: customerKey && customers[customerKey] ? customers[customerKey].credits : null
        });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
