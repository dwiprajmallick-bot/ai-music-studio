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

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

if (!fs.existsSync(ADMINS_PATH)) {
    const salt = crypto.randomBytes(16).toString("hex");
    const adminData = {
        "admin@melodyai.pro": {
            email: "admin@melodyai.pro",
            salt: salt,
            hash: hashPassword("Owner@Secure2026!", salt),
            role: "SUPER_ADMIN",
            twoFactorPin: "998877"
        }
    };
    fs.writeFileSync(ADMINS_PATH, JSON.stringify(adminData, null, 2), "utf8");
}

if (!fs.existsSync(CUSTOMERS_PATH)) {
    fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify({}, null, 2), "utf8");
}

const loginAttempts = {};

function checkRateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    if (loginAttempts[ip] && loginAttempts[ip].count >= 5 && (now - loginAttempts[ip].lastAttempt) < 60000) {
        return res.status(429).json({ success: false, message: "অতিরিক্ত লগইন চেষ্টার কারণে ১ মিনিটের জন্য লক।" });
    }
    next();
}

function recordFailedAttempt(ip) {
    const now = Date.now();
    if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: now };
    loginAttempts[ip].count += 1;
    loginAttempts[ip].lastAttempt = now;
}

// এডমিন লগইন ভেরিফিকেশন
router.post("/admin/login", checkRateLimit, (req, res) => {
    const { email, password, twoFactorCode } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const admins = JSON.parse(fs.readFileSync(ADMINS_PATH, "utf8"));
    const admin = admins[email];

    if (!admin || admin.hash !== hashPassword(password, admin.salt)) {
        recordFailedAttempt(ip);
        return res.status(401).json({ success: false, message: "ভুল এডমিন আইডি বা পাসওয়ার্ড।" });
    }

    if (admin.twoFactorPin !== twoFactorCode) {
        return res.status(403).json({ success: false, message: "ভুল 2FA সিকিউরিটি পিন।" });
    }

    if (loginAttempts[ip]) delete loginAttempts[ip];

    const adminToken = "ADM_SEC_" + crypto.randomBytes(48).toString("hex");
    res.json({
        success: true,
        adminToken,
        role: admin.role,
        email: admin.email,
        message: "এডমিন লগইন সফল।"
    });
});

// এডমিন ক্রেডেনশিয়াল (আইডি, পাসওয়ার্ড, পিন) নিজের মতো পরিবর্তন করার রাউট
router.post("/admin/update-credentials", (req, res) => {
    try {
        const { currentEmail, newEmail, newPassword, newPin } = req.body;
        if (!newEmail || !newPassword || !newPin) {
            return res.status(400).json({ success: false, message: "সব তথ্য প্রদান করুন।" });
        }

        const admins = JSON.parse(fs.readFileSync(ADMINS_PATH, "utf8"));
        
        // পুরাতন একাউন্ট মুছে নতুন সেট করা
        delete admins[currentEmail];

        const salt = crypto.randomBytes(16).toString("hex");
        admins[newEmail] = {
            email: newEmail,
            salt: salt,
            hash: hashPassword(newPassword, salt),
            role: "SUPER_ADMIN",
            twoFactorPin: newPin.trim()
        };

        fs.writeFileSync(ADMINS_PATH, JSON.stringify(admins, null, 2), "utf8");
        res.json({ success: true, message: "এডমিন আইডি, পাসওয়ার্ড ও পিন সফলভাবে পরিবর্তন হয়েছে!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
