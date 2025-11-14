import { put } from '@vercel/blob';
import db from "../config/db.js";

// This is for insert a value
export const addtutor = async (req, res, next) => {
  const {
    dob,
    gender,
    first_name,
    last_name,
    email,
    phone,
    expertise,
    experience_years,
    joining_date,
  } = req.body;

  const file = req.file;

  try {
    // 🔐 Check for duplicates
    const existing = await db.query(
      "SELECT * FROM nystai_tutors WHERE email = $1 OR phone = $2",
      [email, phone]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email or phone already in use" });
    }

    // Upload image to Vercel Blob
    const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
      access: 'public',
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      addRandomSuffix: true
    });

    // 💾 Insert into database
    const result = await db.query(
      `INSERT INTO nystai_tutors 
        (dob, gender, first_name, last_name, email, phone, expertise, experience_years, joining_date, tutor_image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        dob,
        gender,
        first_name,
        last_name,
        email,
        phone,
        expertise,
        experience_years,
        joining_date,
        blob.url, // ✅ Save the image URL
      ]
    );

    res.status(201).json({
      message: "Tutor added successfully",
      tutor: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};


// This is for Update
export const updatetutor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      dob,
      gender,
      first_name,
      last_name,
      email,
      phone,
      expertise,
      experience_years,
      joining_date
    } = req.body;

    const file = req.file;

    // Check if tutor exists
    const existingTutor = await db.query("SELECT * FROM nystai_tutors WHERE tutor_id = $1", [id]);
    if (existingTutor.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Tutor not found"
      });
    }

    let tutorImageUrl = existingTutor.rows[0].tutor_image;

    // If new image provided, upload to Vercel Blob
    if (file) {
      const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
        access: 'public',
        token: process.env.VERCEL_BLOB_RW_TOKEN,
        addRandomSuffix: true
      });
      tutorImageUrl = blob.url; // Update image URL
    }

    // Update query
    const result = await db.query(
      `UPDATE nystai_tutors SET 
        dob = $1,
        gender = $2,
        first_name = $3,
        last_name = $4,
        email = $5,
        phone = $6,
        expertise = $7,
        experience_years = $8,
        joining_date = $9,
        tutor_image = $10
       WHERE tutor_id = $11
       RETURNING *`,
      [
        dob,
        gender,
        first_name,
        last_name,
        email,
        phone,
        expertise,
        experience_years,
        joining_date,
        tutorImageUrl,
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Tutor updated successfully",
      updatedTutor: result.rows[0],
    });

  } catch (error) {
    next(error);
  }
};


// This is for get all tutors
export const getalltutors = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM nystai_tutors ORDER BY tutor_id DESC");
    res.status(200).json({
      success: true,
      message: "All tutors fetched successfully",
      tutors: result.rows,
    });
  } catch (error) {
    next(error);
  }
};


// This is for Get single Tutor
export const getsingletutor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM nystai_tutors WHERE tutor_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully",
      tutor: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};


// This is for Delete a Single Tutor
export const deletetutor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM nystai_tutors WHERE tutor_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Tutor deleted successfully",
      deletedTutor: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};


