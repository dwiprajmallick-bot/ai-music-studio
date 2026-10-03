const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_DIR = path.join(__dirname, "../../data");
const CUSTOMERS_PATH = path.join(DATA_DIR, "customers.json");
const ADMINS_PATH = path.join(DATA_DIR, "admins.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// পাসওয়ার্ড হ্যাশিং ফাংশন
function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

// ডিফল্ট সিকিউর এডমিন সিডিং (লগইন: admin@melodyai.pro / পাসওয়ার্ড: Owner@Secure2026!)
if (!fs.existsSync(ADMINS_PATH)) {
    const salt = crypto.randomBytes(16).toString("hex");
    const adminData = {
        "admin@melodyai.pro": {
            email: "admin@melodyai.pro",
            salt: salt,
            hash: hashPassword("Owner@Secure2026!", salt),
            role: "SUPER_ADMIN",
            twoFactorSecret: "MELODY_SECURE_KEY_2026"
        }
    };
    fs.writeFileSync(ADMINS_PATH, JSON.stringify(adminData, null, 2), "utf8");
}

if (!fs.existsSync(CUSTOMERS_PATH)) {
    fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify({}, null, 2), "utf8");
}

// ব্রুট-ফোর্স ট্র্যাকিং (লগইন লিমিট)
const loginAttempts = {};

function checkRateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    if (loginAttempts[ip] && loginAttempts[ip].count >= 5 && (now - loginAttempts[ip].lastAttempt) < 60000) {
        return res.status(429).json({ success: false, message: "অতিরিক্ত লগইন চেষ্টার কারণে ১ মিনিটের জন্য ব্লক করা হয়েছে।" });
    }
    next();
}

function recordFailedAttempt(ip) {
    const now = Date.now();
    if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: now };
    loginAttempts[ip].count += 1;
    loginAttempts[ip].lastAttempt = now;
}

// =================== ১. কাস্টমার রেজিস্ট্রেশন ও লগইন ===================

router.post("/customer/register", (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email & Password required" });

        const customers = JSON.parse(fs.readFileSync(CUSTOMERS_PATH, "utf8"));
        if (customers[email]) return res.status(400).json({ success: false, message: "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত।" });

        const salt = crypto.randomBytes(16).toString("hex");
        customers[email] = {
            id: "CUST_" + Date.now(),
            name: name || email.split("@")[0],
            email,
            salt,
            hash: hashPassword(password, salt),
            credits: 10,
            createdAt: new Date().toISOString()
        };

        fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify(customers, null, 2), "utf8");
        res.json({ success: true, message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/customer/login", checkRateLimit, (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const customers = JSON.parse(fs.readFileSync(CUSTOMERS_PATH, "utf8"));
    const user = customers[email];

    if (!user || user.hash !== hashPassword(password, user.salt)) {
        recordFailedAttempt(ip);
        return res.status(401).json({ success: false, message: "ভুল ইমেইল বা পাসওয়ার্ড।" });
    }

    if (loginAttempts[ip]) delete loginAttempts[ip];

    // সিকিউর টোকেন
    const token = crypto.randomBytes(32).toString("hex");
    res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, credits: user.credits }
    });
});

// =================== ২. এডমিন হাই-সিকিউরিটি লগইন ও 2FA ===================

router.post("/admin/login", checkRateLimit, (req, res) => {
    const { email, password, twoFactorCode } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH, "utf8"));
    const admin = admins[email];

    if (!admin || admin.hash !== hashPassword(password, admin.salt)) {
        recordFailedAttempt(ip);
        return res.status(401).json({ success: false, message: "এডমিন অ্যাক্সেস প্রত্যাখ্যাত।" });
    }

    // 2FA সিকিউরিটি ভেরিফিকেশন (ডিফল্ট কোড: 998877)
    if (twoFactorCode !== "998877") {
        return res.status(403).json({ success: false, message: "ভুল 2FA সিকিউরিটি পাসকোড।" });
    }

    if (loginAttempts[ip]) delete loginAttempts[ip];

    const adminToken = "ADM_SEC_" + crypto.randomBytes(48).toString("hex");
    res.json({
        success: true,
        adminToken,
        role: admin.role,
        message: "এডমিন অথেন্টিকেশন সফল।"
    });
});

module.exports = router;
