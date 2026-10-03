const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DB_PATH = path.join(__dirname, "../../data/users.json");

// ডাটাবেস ফোল্ডার ও ফাইল নিশ্চিত করা
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}), "utf8");
}

function getUsers() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch {
        return {};
    }
}

function saveUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf8");
}

// গুগল ওয়ান-ট্যাপ / ক্লাউড অথেন্টিকেশন রাউট
router.post("/google", (req, res) => {
    try {
        const { email, name, picture, sub } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email required" });
        }

        const users = getUsers();
        const userId = sub || email.replace(/[^a-zA-Z0-9]/g, "_");

        if (!users[userId]) {
            // নতুন ব্যবহারকারীকে স্বয়ংক্রিয় ১০ ক্রেডিট উপহার
            users[userId] = {
                id: userId,
                email,
                name: name || email.split("@")[0],
                picture: picture || "https://api.dicebear.com/7.x/bottts/svg?seed=" + userId,
                credits: 10,
                createdAt: new Date().toISOString()
            };
        }

        saveUsers(users);

        res.json({
            success: true,
            user: users[userId]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ইউজারের প্রোফাইল ও বর্তমান ক্রেডিট ব্যালেন্স যাচাই
router.get("/me/:id", (req, res) => {
    const users = getUsers();
    const user = users[req.params.id];
    if (user) {
        return res.json({ success: true, user });
    }
    res.status(404).json({ success: false, message: "User not found" });
});

// ক্রেডিট খরচ করার রাউট
router.post("/deduct-credit", (req, res) => {
    const { userId } = req.body;
    const users = getUsers();
    if (users[userId] && users[userId].credits > 0) {
        users[userId].credits -= 1;
        saveUsers(users);
        return res.json({ success: true, credits: users[userId].credits });
    }
    res.status(400).json({ success: false, message: "Insufficient credits" });
});

module.exports = router;
