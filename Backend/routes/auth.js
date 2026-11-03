import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

const generateToken = (user) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing from .env");
    }

    return jwt.sign(
        {
            userId: user._id,
            username: user.username
        },
        jwtSecret,
        { expiresIn: "7d" }
    );
};

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const cleanUsername =
            typeof username === "string" ? username.trim() : "";

        const cleanEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!cleanUsername || !cleanEmail || typeof password !== "string") {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        if (cleanUsername.length < 3 || cleanUsername.length > 30) {
            return res.status(400).json({
                message: "Username must be between 3 and 30 characters"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: cleanEmail },
                { username: cleanUsername }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email or username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        });

        await newUser.save();

        const token = generateToken(newUser);

        return res.status(201).json({
            token,
            username: newUser.username
        });

    } catch (err) {
        console.error("Signup error:", err);

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email or username already exists"
            });
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const cleanEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!cleanEmail || typeof password !== "string" || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            token,
            username: user.username
        });

    } catch (err) {
        console.error("Login error:", err);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

// Update user profile
router.post("/update", authMiddleware, async (req, res) => {
    try {
        const { username, email, newPassword } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!username && !email && !newPassword) {
            return res.status(400).json({
                message: "No profile changes provided"
            });
        }

        if (username) {
            if (typeof username !== "string") {
                return res.status(400).json({
                    message: "Invalid username"
                });
            }

            const cleanUsername = username.trim();

            if (cleanUsername.length < 3 || cleanUsername.length > 30) {
                return res.status(400).json({
                    message: "Username must be between 3 and 30 characters"
                });
            }

            const existingUsername = await User.findOne({
                username: cleanUsername,
                _id: { $ne: user._id }
            });

            if (existingUsername) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }

            user.username = cleanUsername;
        }

        if (email) {
            if (typeof email !== "string") {
                return res.status(400).json({
                    message: "Invalid email address"
                });
            }

            const cleanEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(cleanEmail)) {
                return res.status(400).json({
                    message: "Please enter a valid email address"
                });
            }

            const existingEmail = await User.findOne({
                email: cleanEmail,
                _id: { $ne: user._id }
            });

            if (existingEmail) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            user.email = cleanEmail;
        }

        if (newPassword) {
            if (typeof newPassword !== "string" || newPassword.length < 8) {
                return res.status(400).json({
                    message: "New password must contain at least 8 characters"
                });
            }

            user.password = await bcrypt.hash(newPassword, 12);
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            username: user.username,
            email: user.email
        });

    } catch (err) {
        console.error("Profile update error:", err);

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Email or username already exists"
            });
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

export default router;
