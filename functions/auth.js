import bcrypt from "bcryptjs";
import db from "../database/db.js"; 
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


export const handleSignUp = async (req, res) => {
  const { name, username, password, contact_number } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    // Hash the password before storing it
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO Users (name, username, password, contact_number)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username
    `;
    const values = [name, username, hashedPassword, contact_number];

    const result = await db.query(query, values); 

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Signup Error:", error);
    if (error.code === "23505") {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleSignIn = async (req, res) => {
    console.log("this is secret:", JWT_SECRET);
    const { username, password } = req.body;
  
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    try {
      // Find user by username
      const result = await db.query(
        "SELECT * FROM Users WHERE username = $1",
        [username]
      );
  
      const user = result.rows[0];
  
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Create token (omit password in payload)
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          contact_number: user.contact_number,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };