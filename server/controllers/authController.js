const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = db
      .prepare(
        "SELECT * FROM users WHERE email = ?"
      )
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    db.prepare(`
      INSERT INTO users
      (name,email,password)
      VALUES (?,?,?)
    `).run(
      name,
      email,
      hashedPassword
    );

    res.status(201).json({
      message: "User registered",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};



const login = async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const user = db
      .prepare(
        "SELECT * FROM users WHERE email = ?"
      )
      .get(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token =
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

    res.json({
      token,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

module.exports = {
  register,
  login,
};