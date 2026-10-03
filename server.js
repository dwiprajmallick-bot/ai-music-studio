const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const apiRoutes = require("./src/routes/api");
const paymentRoutes = require("./src/routes/payment");
const adminRoutes = require("./src/routes/admin");
const secureAuthRoutes = require("./src/routes/secureAuth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static(path.join(__dirname, "storage")));

// API রাউটস
app.use("/api", apiRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", secureAuthRoutes);

// সুরক্ষিত আলাদা পেজ রাউটস
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "customer-login.html"));
});

app.get("/admin-portal", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// মূল ফ্রন্টএন্ড
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
