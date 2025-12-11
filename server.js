require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));


app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://spro-deal-customer-care.netlify.app"
  ],
  credentials: true
}));


app.use(bodyParser.json());

// ----------------------------------
//       MySQL Connection
// ----------------------------------
// const db = mysql.createConnection({
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASS || "Jayprakash69@",
//     database: process.env.DB_NAME || "auth_system"
// });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.log("MySQL connection failed!", err);
        return;
    }
    console.log("MySQL connected successfully!");
});

// ----------------------------------
// Your Routes (Same as before)
// ----------------------------------

app.post("/login", (req, res) => {
    const { phone, password } = req.body;
    const sql = "INSERT INTO users (phone, password) VALUES (?, ?)";
    db.query(sql, [phone, password], (err, result) => {
        if (err) return res.json({ success: false, message: "Error!" });
        res.json({ success: true, user_id: result.insertId });
    });
});

app.post("/verify", (req, res) => {
    const { user_id, full_name, dob, problem, security_pin, experience } = req.body;
    const sql = "INSERT INTO verification (user_id, full_name, dob, problem, security_pin, experience) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [user_id, full_name, dob, problem, security_pin, experience], (err, result) => {
        if (err) return res.json({ success: false, message: err });
        res.json({ success: true, message: "Verification submitted!" });
    });
});

app.get("/admin/getUsers", (req, res) => {
    db.query("SELECT * FROM users ORDER BY id DESC", (err, results) => {
        if (err) return res.json({ success: false, error: err });
        res.json(results);
    });
});

app.get("/admin/getVerification", (req, res) => {
    db.query("SELECT * FROM verification ORDER BY id DESC", (err, results) => {
        if (err) return res.json({ success: false, error: err });
        res.json(results);
    });
});

// ------------------- Update & Delete -------------------
app.put("/admin/updateUser/:id", (req, res) => {
    const { phone, password } = req.body;
    db.query("UPDATE users SET phone=?, password=? WHERE id=?", [phone, password, req.params.id], (err) => {
        if (err) return res.json({ success:false, error: err });
        res.json({ success:true });
    });
});

app.delete("/admin/deleteUser/:id", (req, res) => {
    db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
        if (err) return res.json({ success:false, error: err });
        res.json({ success:true });
    });
});

app.delete("/admin/deleteVerification/:id", (req, res) => {
    db.query("DELETE FROM verification WHERE id=?", [req.params.id], (err) => {
        if (err) return res.json({ success:false, error: err });
        res.json({ success:true });
    });
});

app.post("/admin-login", (req, res) => {
    const { password } = req.body;

    const sql = "SELECT * FROM admin WHERE password = ?";
    db.query(sql, [password], (err, result) => {
        if (err) return res.json({ success: false, message: "Database error" });

        if (result.length === 0) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        return res.json({ success: true, message: "Login successful" });
    });
});


// ----------------------------------
// Start Server (Important Change!)
// ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
