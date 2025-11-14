import db from "../config/db.js";

export const generateStudentRegisterNumber = async (course) => {
  const courseCode = course.toUpperCase(); // IOT or CCTV
  const currentYear = new Date().getFullYear(); // 2025

  const prefix = `NYST${currentYear}${courseCode}`;

  // Count existing register numbers for this course and year
  const result = await db.query(
    `SELECT COUNT(*) FROM studentcoursedetails WHERE studentregisternumber LIKE $1`,
    [`${prefix}%`]
  );

  const count = parseInt(result.rows[0].count || 0) + 1;

  const serial = String(count).padStart(3, "0"); // 001, 002, etc.

  return `${prefix}${serial}`; // NYST2025IOT001 or NYST2025CCTV001
};
