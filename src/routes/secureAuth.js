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

if (!fs.existsSync(CUSTOMERS_PATH)) {
    fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify({}, null, 2), "utf8");
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

const loginAttempts = {};
const phoneOtpStore = {}; // মেমোরি ওটিপি ক্যাশ: { fullPhone: { otp, expires } }

function checkRateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    if (loginAttempts[ip] && loginAttempts[ip].count >= 5 && (now - loginAttempts[ip].lastAttempt) < 60000) {
        return res.status(429).json({ success: false, message: "অতিরিক্ত চেষ্টার কারণে ১ মিনিটের জন্য ব্লক।" });
    }
    next();
}

function recordFailedAttempt(ip) {
    const now = Date.now();
    if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: now };
    loginAttempts[ip].count += 1;
    loginAttempts[ip].lastAttempt = now;
}

// কাস্টমার রেজিস্ট্রেশন (ইমেইল ও পাসওয়ার্ড)
router.post("/customer/register", (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "ইমেইল ও পাসওয়ার্ড প্রদান আবশ্যক।" });

        const customers = JSON.parse(fs.readFileSync(CUSTOMERS_PATH, "utf8"));
        if (customers[email]) return res.status(400).json({ success: false, message: "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত।" });

        const salt = crypto.randomBytes(16).toString("hex");
        customers[email] = {
            id: "CUST_" + Date.now(),
            name: name || email.split("@")[0],
            email,
            phone: "",
            salt,
            hash: hashPassword(password, salt),
            credits: 10,
            createdAt: new Date().toISOString()
        };

        fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify(customers, null, 2), "utf8");
        res.json({ success: true, message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এখন লগইন করুন।" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// কাস্টমার লগইন (ইমেইল ও পাসওয়ার্ড)
router.post("/customer/login", checkRateLimit, (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const customers = JSON.parse(fs.readFileSync(CUSTOMERS_PATH, "utf8"));
    const user = customers[email];

    if (!user || !user.hash || user.hash !== hashPassword(password, user.salt)) {
        recordFailedAttempt(ip);
        return res.status(401).json({ success: false, message: "ভুল ইমেইল বা পাসওয়ার্ড।" });
    }

    if (loginAttempts[ip]) delete loginAttempts[ip];
    const token = crypto.randomBytes(32).toString("hex");

    res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, credits: user.credits }
    });
});

// আন্তর্জাতিক মোবাইল ওটিপি জেনারেশন
router.post("/customer/phone/send-otp", (req, res) => {
    const { countryCode, phoneNumber } = req.body;
    if (!countryCode || !phoneNumber || phoneNumber.length < 6) {
        return res.status(400).json({ success: false, message: "সঠিক দেশের কোড ও মোবাইল নম্বর দিন।" });
    }

    const fullPhone = `${countryCode}${phoneNumber}`.replace(/\s+/g, "");
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    phoneOtpStore[fullPhone] = {
        otp: generatedOtp,
        expires: Date.now() + 5 * 60 * 1000
    };

    console.log(`[Global SMS Gateway] OTP for ${fullPhone}: ${generatedOtp}`);

    res.json({
        success: true,
        message: "আপনার মোবাইল নম্বরে ৬ সংখ্যার ওটিপি পাঠানো হয়েছে।",
        fullPhone,
        demoOtp: generatedOtp // টেস্ট করার সুবিধার্থে সরাসরি পাঠানো হলো
    });
});

// আন্তর্জাতিক মোবাইল ওটিপি ভেরিফিকেশন ও অটো-রেজিস্ট্রেশন
router.post("/customer/phone/verify-otp", (req, res) => {
    const { fullPhone, otp } = req.body;
    const record = phoneOtpStore[fullPhone];

    if (!record || record.expires < Date.now()) {
        return res.status(400).json({ success: false, message: "ওটিপির মেয়াদ শেষ অথবা অনুরোধ পাওয়া যায়নি।" });
    }

    if (record.otp !== otp.trim()) {
        return res.status(400).json({ success: false, message: "ভুল ওটিপি কোড।" });
    }

    delete phoneOtpStore[fullPhone];

    const customers = JSON.parse(fs.readFileSync(CUSTOMERS_PATH, "utf8"));
    const userKey = "phone_" + fullPhone;
    let user = customers[userKey];

    if (!user) {
        user = {
            id: "CUST_" + Date.now(),
            name: "User " + fullPhone.slice(-4),
            email: "",
            phone: fullPhone,
            credits: 10,
            createdAt: new Date().toISOString()
        };
        customers[userKey] = user;
        fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify(customers, null, 2), "utf8");
    }

    const token = crypto.randomBytes(32).toString("hex");
    res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, phone: user.phone, credits: user.credits },
        message: "মোবাইল ওটিপি যাচাই সফল!"
    });
});

// এডমিন লগইন
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
        email: admin.email
    });
});

// এডমিন ক্রেডেনশিয়াল আপডেট
router.post("/admin/update-credentials", (req, res) => {
    try {
        const { currentEmail, newEmail, newPassword, newPin } = req.body;
        if (!newEmail || !newPassword || !newPin) {
            return res.status(400).json({ success: false, message: "সব তথ্য প্রদান করুন।" });
        }

        const admins = JSON.parse(fs.readFileSync(ADMINS_PATH, "utf8"));
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
        res.json({ success: true, message: "এডমিন তথ্য সফলভাবে আপডেট হয়েছে!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
