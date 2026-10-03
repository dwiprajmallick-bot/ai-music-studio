const express = require("express");
const router = express.Router();

// পেমেন্ট অর্ডার বা চেকআউট সেশন তৈরি
router.post("/create-order", async (req, res) => {
    try {
        const { planId, amount, currency, credits } = req.body;

        // ডামি অর্ডার আইডি জেনারেশন (Stripe বা Razorpay API Keys বসালে লাইভ গেটওয়ে সক্রিয় হবে)
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

        res.json({
            success: true,
            orderId,
            amount,
            currency: currency || "USD",
            credits,
            checkoutUrl: `https://checkout.stripe.com/pay/${orderId}`,
            message: "পেমেন্ট গেটওয়ে সেশন প্রস্তুত।"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// পেমেন্ট সফল হলে ক্রেডিট ভেরিফিকেশন ওয়েবহুক
router.post("/verify-payment", async (req, res) => {
    const { orderId, paymentStatus } = req.body;
    if (paymentStatus === "PAID") {
        return res.json({ success: true, verified: true, message: "ক্রেডিট সফলভাবে অ্যাকাউন্টে যোগ হয়েছে।" });
    }
    res.status(400).json({ success: false, message: "পেমেন্ট সম্পন্ন হয়নি।" });
});

module.exports = router;
