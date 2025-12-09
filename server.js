const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------- MySQL Connection -------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Jayprakash69@",   
    database: "auth_system"
});

db.connect(err => {
    if (err) {
        console.log("MySQL Connection Failed!", err);
        return;
    }
    console.log("MySQL Connected Successfully!");
});

// ------------------- LOGIN -------------------
app.post("/login", (req, res) => {
    const { phone, password } = req.body;

    const sql = "INSERT INTO users (phone, password) VALUES (?, ?)";

    db.query(sql, [phone, password], (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Something went wrong!" });
        }

        res.json({ success: true, user_id: result.insertId });
    });
});



// ------------------- SAVE VERIFICATION -------------------
app.post("/verify", (req, res) => {
    const { user_id, full_name, dob, problem, security_pin, experience } = req.body;

    if(!user_id) return res.json({ success: false, message: "User ID missing" });

    const sql = `INSERT INTO verification 
        (user_id, full_name, dob, problem, security_pin, experience) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [user_id, full_name, dob, problem, security_pin, experience], (err, result) => {
        if(err) return res.json({ success: false, message: err });

        res.json({ success: true, message: "Verification submitted successfully!" });
    });
});
// -------------Admin get data---------
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


app.get("/showData", (req, res) => {
    db.query("SELECT * FROM your_table_name", (err, results) => {
        if (err) return res.send(err);
        res.json(results);
    });
});


// ------------------- ADMIN UPDATE USER -------------------
app.put("/admin/updateUser/:id", (req, res) => {
    const userId = req.params.id;
    const { phone, password } = req.body;

    const sql = "UPDATE users SET phone=?, password=? WHERE id=?";
    db.query(sql, [phone, password, userId], (err, result) => {
        if(err) return res.json({ success:false, message: err });
        res.json({ success:true, message:"User updated successfully!" });
    });
});

// ------------------- ADMIN DELETE USER -------------------
app.delete("/admin/deleteUser/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id=?";
    db.query(sql, [userId], (err, result) => {
        if(err) return res.json({ success:false, message: err });
        res.json({ success:true, message:"User deleted successfully!" });
    });
});

// ------------------- ADMIN DELETE VERIFICATION -------------------
app.delete("/admin/deleteVerification/:id", (req, res) => {
    const verId = req.params.id;
    const sql = "DELETE FROM verification WHERE id=?";
    db.query(sql, [verId], (err, result) => {
        if(err) return res.json({ success:false, message: err });
        res.json({ success:true, message:"Verification deleted successfully!" });
    });
});


// ------------------- START SERVER -------------------
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
