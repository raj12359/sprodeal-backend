require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

<<<<<<< HEAD
// -------------------- CORS --------------------
app.use(cors({
  origin: "http://127.0.0.1:5500", // or your local frontend URL
  credentials: true
}));


app.use(bodyParser.json());

// -------------------- MongoDB Connection --------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rajeev913572_db_user:Rajeev69%40@rajeev.cjfckjj.mongodb.net/auth_system?retryWrites=true&w=majority";

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch(err => console.log("MongoDB connection error:", err));

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
=======
// -------------------- CORS Setup --------------------
// ✅ Directly allow Netlify frontend and localhost for testing
app.use(cors({
    origin: [
        "https://spro-custmercare.netlify.app", // deployed frontend
        "http://localhost:5500",                // local testing
        "http://127.0.0.1:5500"                 // local testing
    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json()); // for parsing JSON requests

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

// User login / signup
app.post("/login", async (req, res) => {
    try {
        const { phone, password } = req.body;
        const newUser = new User({ phone, password });
        const savedUser = await newUser.save();
        res.json({ success: true, user_id: savedUser._id });
    } catch (err) {
        res.json({ success: false, message: err.message });
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
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
<<<<<<< HEAD
        console.log(err);
=======
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
        res.json({ success: false, message: err.message });
    }
});

<<<<<<< HEAD
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
=======
// Admin routes
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

app.get("/admin/getUsers", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

<<<<<<< HEAD
// Update user
app.put("/admin/updateUser/:id", async (req, res) => {
    try {
        const { phone, password } = req.body;
        await User.findByIdAndUpdate(req.params.id, { phone, password });
        res.json({ success: true });
=======
app.get("/admin/getVerification", async (req, res) => {
    try {
        const verifications = await Verification.find().sort({ createdAt: -1 });
        res.json(verifications);
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

<<<<<<< HEAD
// Delete user
app.delete("/admin/deleteUser/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
=======
app.put("/admin/updateUser/:id", async (req, res) => {
    try {
        const { phone, password } = req.body;
        await User.findByIdAndUpdate(req.params.id, { phone, password });
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

<<<<<<< HEAD
// Delete verification
app.delete("/admin/deleteVerification/:id", async (req, res) => {
    try {
        await Verification.findByIdAndDelete(req.params.id);
=======
app.delete("/admin/deleteUser/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

<<<<<<< HEAD
// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
=======
app.delete("/admin/deleteVerification/:id", async (req, res) => {
    try {
        await Verification.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// -------------------- Default Route --------------------
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
>>>>>>> f6f8d88a23c0c70f99838da2253500aab9a85568
