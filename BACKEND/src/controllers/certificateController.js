// backend/controllers/certificateController.js
import pool from "../config/db.js"; // PostgreSQL pool
import { put } from "@vercel/blob";
import { generateCertificateId } from "../utils/generateCertificateId.js";

// Verify certificate with 2 random fields
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId, aadhar, email, pan, phone } = req.body;

    if (!certificateId) {
      return res.status(400).json({ success: false, error: "CertificateId is required" });
    }

    // Collect submitted fields
    const submittedFields = { aadhar, email, pan, phone };
    const filledFields = Object.entries(submittedFields).filter(([_, value]) => value);

    // Require exactly 2 fields
    if (filledFields.length !== 2) {
      return res.status(400).json({
        success: false,
        error: "Exactly 2 fields must be provided",
        hint: "Enter any 2 of Aadhar, Email, PAN, or Phone"
      });
    }

    // Fetch student by certificateId
    const result = await pool.query(
      `SELECT spi.student_id, spi.aadhar_number, spi.email, spi.pan_number, spi.phone,
              suq.certificate_id, suq.certificate_status, suq.certificate_url
       FROM studentsuniqueqrcode suq
       JOIN studentspersonalinformation spi ON suq.student_id = spi.student_id
       WHERE suq.certificate_id = $1 AND suq.certificate_status='completed'`,
      [certificateId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Certificate not found or inactive" });
    }

    const student = result.rows[0];

    // Validate submitted fields
    let matches = 0;
    if (aadhar && aadhar === student.aadhar_number) matches++;
    if (email && email === student.email) matches++;
    if (pan && pan === student.pan_number) matches++;
    if (phone && phone === student.phone) matches++;

    if (matches !== 2) {
      return res.status(401).json({ success: false, error: "Verification failed: fields do not match" });
    }

    // Success → return certificate URL
    return res.json({
      success: true,
      certificateUrl: student.certificate_url,
      certificateId: student.certificate_id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};

// Upload certificate for a student
export const uploadCertificateForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const file = req.file;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required in route" });
    }
    if (!file) {
      return res.status(400).json({ success: false, error: "Certificate file is required" });
    }

    // ✅ Check if student already has a certificateId
    const existing = await pool.query(
      `SELECT certificate_id 
       FROM studentsuniqueqrcode 
       WHERE student_id = $1`,
      [studentId]
    );

    let certificateId;

    if (existing.rows.length > 0 && existing.rows[0].certificate_id) {
      // Reuse the existing certificateId
      certificateId = existing.rows[0].certificate_id;
    } else {
      // Generate only if not already assigned
      certificateId = await generateCertificateId();
    }

    // Upload to Vercel Blob
    const blob = await put(`certificates/${file.originalname}`, file.buffer, {
      access: "public",
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      addRandomSuffix: true,
    });

    const certificateUrl = blob.url;

    // ✅ Update row, do not override certificateId if already set
    await pool.query(
      `INSERT INTO studentsuniqueqrcode (student_id, certificate_id, certificate_url, certificate_status)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id)
       DO UPDATE SET 
         certificate_url = EXCLUDED.certificate_url, 
         certificate_status = EXCLUDED.certificate_status`,
      [studentId, certificateId, certificateUrl, "completed"]
    );

    res.status(200).json({
      success: true,
      message: `Certificate uploaded successfully for student ID ${studentId}`,
      certificateId,
      certificateUrl,
    });
  } catch (err) {
    console.error("Error uploading certificate:", err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};

// Get certificate for a student
export const getCertificateForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required" });
    }

    const result = await pool.query(
      `SELECT certificate_id, certificate_url, certificate_status
       FROM studentsuniqueqrcode
       WHERE student_id = $1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No certificate found for this student"
      });
    }

    const certificate = result.rows[0];

    res.status(200).json({
      success: true,
      certificateId: certificate.certificate_id,
      certificateUrl: certificate.certificate_url,
      certificateStatus: certificate.certificate_status,
    });
  } catch (err) {
    console.error("Error fetching certificate:", err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};


// Update certificate for a student (only image, no status change)
export const updateCertificateForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const file = req.file;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required in route" });
    }
    if (!file) {
      return res.status(400).json({ success: false, error: "New certificate file is required" });
    }

    // ✅ Check if certificate exists for this student
    const existing = await pool.query(
      `SELECT certificate_id, certificate_status FROM studentsuniqueqrcode WHERE student_id = $1`,
      [studentId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: "No existing certificate found for this student" });
    }

    const { certificate_id: certificateId, certificate_status: currentStatus } = existing.rows[0];

    // Upload new certificate to Vercel Blob
    const blob = await put(`certificates/${file.originalname}`, file.buffer, {
      access: "public",
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      addRandomSuffix: true,
    });

    const certificateUrl = blob.url;

    // ✅ Only update the image, keep old status
    await pool.query(
      `UPDATE studentsuniqueqrcode
       SET certificate_url = $1
       WHERE student_id = $2`,
      [certificateUrl, studentId]
    );

    res.status(200).json({
      success: true,
      message: `Certificate image updated successfully for student ID ${studentId}`,
      certificateId,
      certificateUrl,
      certificateStatus: currentStatus // return unchanged status
    });
  } catch (err) {
    console.error("Error updating certificate:", err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};


// Delete only certificate image for a student (keep student_id & certificate_id)
export const deleteCertificateImageForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ success: false, error: "studentId is required" });
    }

    // ✅ Check if certificate exists
    const existing = await pool.query(
      `SELECT certificate_id, certificate_url, certificate_status 
       FROM studentsuniqueqrcode 
       WHERE student_id = $1`,
      [studentId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: "No certificate found for this student" });
    }

    // ✅ Remove only image URL, keep certificateId intact
    await pool.query(
      `UPDATE studentsuniqueqrcode
       SET certificate_url = NULL
       WHERE student_id = $1`,
      [studentId]
    );

    res.status(200).json({
      success: true,
      message: `Certificate image removed for student ID ${studentId}`,
      certificateId: existing.rows[0].certificate_id,
      certificateStatus: existing.rows[0].certificate_status
    });
  } catch (err) {
    console.error("Error deleting certificate image:", err);
    res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
};

