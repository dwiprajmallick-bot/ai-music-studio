const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_DIR = path.join(__dirname, "../../data");
const SETTINGS_PATH = path.join(DATA_DIR, "site_settings.json");
const ORDERS_PATH = path.join(DATA_DIR, "orders.json");
const USERS_PATH = path.join(DATA_DIR, "customers.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ডিফল্ট সাইট সেটিংস কনফিগারেশন
if (!fs.existsSync(SETTINGS_PATH)) {
    const defaultSettings = {
        bannerNotice: "🔥 সীমিত সময়ের জন্য নতুন অ্যাকাউন্ট খুললেই ১০ ফ্রি ক্রেডিট উপহার!",
        starterPrice: "399",
        creatorPrice: "1199",
        trendingChips: [
            "A soulful acoustic love melody under the rainy streetlights",
            "High-energy EDM drop with futuristic bass",
            "Relaxing chill Lo-Fi beats for deep late night study sessions"
        ]
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaultSettings, null, 2), "utf8");
}

function getData(filePath, isArray = false) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        return isArray ? [] : {};
    }
}

// এডমিন মেট্রিক্স
router.get("/metrics", (req, res) => {
    try {
        const users = getData(USERS_PATH);
        const orders = getData(ORDERS_PATH, true);
        const totalUsers = Object.keys(users).length || 15;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.status === "SUCCESS" ? o.amount : 0), 0);
        
        res.json({
            success: true,
            totalUsers,
            totalOrders: orders.length,
            totalRevenue,
            currency: "₹",
            recentOrders: orders.reverse().slice(0, 10)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// লাইভ সাইট সেটিংস পাওয়ার রাউট
router.get("/site-settings", (req, res) => {
    const settings = getData(SETTINGS_PATH);
    res.json({ success: true, settings });
});

// এডমিন প্যানেল থেকে লাইভ কনটেন্ট আপডেট করার রাউট
router.post("/update-site-settings", (req, res) => {
    try {
        const { bannerNotice, starterPrice, creatorPrice, trendingChips } = req.body;
        const settings = {
            bannerNotice: bannerNotice || "",
            starterPrice: starterPrice || "399",
            creatorPrice: creatorPrice || "1199",
            trendingChips: trendingChips || []
        };
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
        res.json({ success: true, message: "সাইটের কনটেন্ট সফলভাবে আপডেট হয়েছে!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
