import jwt from "jsonwebtoken";
 
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env
 
// Generate token
export const generateAssignmentToken = (studentId, taskId) => {
  return jwt.sign(
    { studentId, taskId },
    JWT_SECRET,
    { expiresIn: "7d" } // expire in 7 days
  );
};
 
// Verify token
export const verifyAssignmentToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};