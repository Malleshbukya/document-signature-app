const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser = db
      .prepare(
        "SELECT * FROM users WHERE email = ?"
      )
      .get(email);

    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    db.prepare(`
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES
      (
        ?,
        ?,
        ?
      )
    `).run(
      name,
      email,
      hashedPassword
    );

    res.status(201).json({
      message:
        "User registered",
    });

  } catch (error) {

    console.log(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({
      error:
        error.message,
    });

  }

};

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const users = db
      .prepare(
        "SELECT * FROM users"
      )
      .all();

    console.log(
      "ALL USERS:",
      users
    );

    console.log(
      "EMAIL:",
      email
    );

    console.log(
      "PASSWORD:",
      password
    );

    const user = db
      .prepare(
        "SELECT * FROM users WHERE email = ?"
      )
      .get(email);

    console.log(
      "USER:",
      user
    );

    if (!user) {

      return res.status(400).json({
        message:
          "User not found",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "PASSWORD MATCH:",
      isMatch
    );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Wrong password",
      });

    }

    const token =
      jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

    console.log(
      "LOGIN SUCCESS"
    );

    res.json({
      token,
    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      error:
        error.message,
    });

  }

};

module.exports = {
  register,
  login,
};