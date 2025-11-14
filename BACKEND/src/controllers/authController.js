import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Signup for superadmin and tutor roles
// This will be a single API for both roles
export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    if (!['superadmin', 'tutor'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const userExist = await pool.query("SELECT * FROM nystai_users WHERE email=$1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO nystai_users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ success: true, user: newUser.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Login (single API for all roles)
// This will be a single API for all roles
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM nystai_users WHERE email=$1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    next(err);
  }
};
