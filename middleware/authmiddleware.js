import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js"; 



export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // req.user = decoded; 
    console.log("Decoded token:", decoded.id);
    req.userId = decoded.id;
    next(); 
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
