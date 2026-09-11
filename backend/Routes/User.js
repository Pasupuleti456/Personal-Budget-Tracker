const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const  ensureAuthenticated  = require("../Middlewares/Auth");

// ✅ Set Initial Income (Only if Not Already Set)
router.post("/set-income", ensureAuthenticated, async (req, res) => {
    try {
        const { income } = req.body;
        if (typeof income !== "number" || income < 0) {
            return res.status(400).json({ message: "Invalid income" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.income > 0) { // 🔹 Prevent resetting income
            return res.status(400).json({ message: "Income already set. Use update instead." });
        }

        user.income = income;
        await user.save();

        res.json({ success: true, message: "Income saved successfully", income: user.income });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Get User Income (Corrected)
router.get("/income", ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId).select("income");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, income: user.income || 0 });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Update Income
router.put("/update-income", ensureAuthenticated, async (req, res) => {
    try {
        const { income } = req.body;
        if (typeof income !== "number" || income < 0) {
            return res.status(400).json({ success: false, message: "Invalid income" });
        }

        const userId = req.user.id || req.user._id;
        const user = await User.findByIdAndUpdate(userId, { income }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, message: "Income updated successfully", income: user.income });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

module.exports = router;
