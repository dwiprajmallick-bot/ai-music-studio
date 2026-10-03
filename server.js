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

// কাস্টমার পেজ রাউটস
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "customer-login.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "public", "about.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "public", "contact.html")));
app.get("/terms", (req, res) => res.sendFile(path.join(__dirname, "public", "terms.html")));
app.get("/privacy", (req, res) => res.sendFile(path.join(__dirname, "public", "privacy.html")));
app.get("/system-status", (req, res) => res.sendFile(path.join(__dirname, "public", "status.html")));
app.get("/refund", (req, res) => res.sendFile(path.join(__dirname, "public", "refund.html")));

// মালিকের গোপন এডমিন রাউট
app.get("/secret-owner-gateway", (req, res) => res.sendFile(path.join(__dirname, "public", "admin-login.html")));
app.get("/owner-dashboard-view", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));

// হোমপেজ
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

