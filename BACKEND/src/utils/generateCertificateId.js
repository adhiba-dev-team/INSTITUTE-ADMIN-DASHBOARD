// utils/certificate.js
import pool from "../config/db.js";

export const generateCertificateId = async () => {
  const currentYear = new Date().getFullYear();

  // Get latest certificate ID for this year
  const result = await pool.query(
    `SELECT certificate_id 
     FROM studentsuniqueqrcode 
     WHERE certificate_id LIKE $1
     ORDER BY certificate_id DESC 
     LIMIT 1`,
    [`CERT${currentYear}NYST%`]
  );

  let nextNumber = 1;

  if (result.rows.length > 0) {
    const lastId = result.rows[0].certificate_id; // e.g. CERT2025NYST007
    const match = lastId.match(/(\d{3})$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  const padded = String(nextNumber).padStart(3, "0");

  return `CERT${currentYear}NYST${padded}`;
};
