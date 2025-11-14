import { put } from '@vercel/blob';
import db from '../config/db.js';
import pool from '../config/db.js';


// Adding courses to the database
// This function handles the course addition logic, including image upload and database insertion
// export const Addingcourses = async (req, res, next) => {
//   const { course_name, course_duration, card_overview } = req.body;
//   const file = req.file;

//   try {
//     if (!file) {
//       return res.status(400).json({
//         success: false,
//         detail: "Image file is required"
//       });
//     }

//     // Check if the same course already exists
//     const checkQuery = `
//       SELECT * FROM nystaiallcourses 
//       WHERE course_name = $1 AND course_duration = $2 AND card_overview = $3
//     `;
//     const existing = await db.query(checkQuery, [course_name, course_duration, card_overview]);

//     if (existing.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'This Course is already exists'
//       });
//     }

//     // Upload image to Vercel Blob
//     const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
//       access: 'public',
//       token: process.env.VERCEL_BLOB_RW_TOKEN,
//       addRandomSuffix: true
//     });

//     // Insert into Neon DB
//     const result = await db.query(
//       `INSERT INTO nystaiallcourses (course_name, course_duration, card_overview, image_url)
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [course_name, course_duration, card_overview, blob.url]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Course added successfully',
//       data: result.rows
//     });
//   } catch (err) {
//     next(err);
//   }
// };


export const addCourseWithPlan = async (req, res, next) => {
  const file = req.file;
  const {
    course_name,
    course_duration,
    card_overview,
    price,
    point_1,
    point_2,
    point_3,
    point_4,
    point_5,
    point_6,
    point_7
  } = req.body;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    if (!file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Upload image to Vercel Blob
    const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
      access: 'public',
      token: process.env.VERCEL_BLOB_RW_TOKEN,
      addRandomSuffix: true
    });

    // Insert into nystaiallcourses
    const courseResult = await client.query(
      `INSERT INTO nystaiallcourses (course_name, course_duration, card_overview, image_url)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [course_name, course_duration, card_overview, blob.url]
    );

    const courseId = courseResult.rows[0].id;

    // Insert into nystai_pricing_plans
    await client.query(
      `INSERT INTO nystai_pricing_plans
       (plan_name, price, point_1, point_2, point_3, point_4, point_5, point_6, point_7, course_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        course_name,
        price,
        point_1,
        point_2,
        point_3,
        point_4,
        point_5,
        point_6,
        point_7,
        courseId
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Course and pricing plan added successfully',
      course_id: courseId
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};


// Fetching all courses from the database
// This function retrieves all courses and their details from the database
// export const getAllCourses = async (req, res, next) => {
//   try {
//     const result = await db.query(`SELECT * FROM nystaiallcourses ORDER BY id DESC`);

//     res.status(200).json({
//       success: true,
//       message: 'Courses fetched successfully',
//       data: result.rows
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const getAllCoursesWithPlans = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.id AS course_id,
        c.course_name,
        c.course_duration,
        c.card_overview,
        c.image_url,
        p.id AS plan_id,
        p.price,
        p.point_1,
        p.point_2,
        p.point_3,
        p.point_4,
        p.point_5,
        p.point_6,
        p.point_7
      FROM nystaiallcourses c
      LEFT JOIN nystai_pricing_plans p
      ON c.id = p.course_id
      ORDER BY c.id DESC;
    `;

    const result = await db.query(query);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};




// Deleting a course from the database
// This function handles the deletion of a course by its ID
// export const deleteCourse = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     // Check if course exists
//     const course = await db.query(`SELECT * FROM nystaiallcourses WHERE id = $1`, [id]);
//     if (course.rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Course not found' });
//     }

//     // Delete course
//     await db.query(`DELETE FROM nystaiallcourses WHERE id = $1`, [id]);

//     res.status(200).json({ success: true, message: 'Course deleted successfully' });
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteCourseWithPlan = async (req, res, next) => {
  const { id } = req.params;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Check if course exists
    const course = await client.query(`SELECT * FROM nystaiallcourses WHERE id = $1`, [id]);
    if (course.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete associated pricing plans first
    await client.query(`DELETE FROM nystai_pricing_plans WHERE course_id = $1`, [id]);

    // Delete the course
    await client.query(`DELETE FROM nystaiallcourses WHERE id = $1`, [id]);

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Course and pricing plans deleted successfully'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};




// Update a course by ID
// This function updates course details, including optional image upload
// export const updateCourse = async (req, res, next) => {
//   const { id } = req.params;
//   const { course_name, course_duration, card_overview } = req.body;
//   const file = req.file;

//   try {
//     let imageUrl;

//     if (file) {
//       const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
//         access: 'public',
//         token: process.env.VERCEL_BLOB_RW_TOKEN,
//         addRandomSuffix: true
//       });
//       imageUrl = blob.url;
//     }

//     const query = `
//       UPDATE nystaiallcourses
//       SET 
//         course_name = $1,
//         course_duration = $2,
//         card_overview = $3
//         ${imageUrl ? `, image_url = $4` : ''}
//       WHERE id = $${imageUrl ? 5 : 4}
//       RETURNING *
//     `;

//     const values = imageUrl
//       ? [course_name, course_duration, card_overview, imageUrl, id]
//       : [course_name, course_duration, card_overview, id];

//     const result = await db.query(query, values);

//     res.status(200).json({
//       success: true,
//       message: 'Course updated successfully',
//       data: result.rows
//     });
//   } catch (err) {
//     next(err);
//   }
// };


export const updateCourseWithPlan = async (req, res, next) => {
  const { id } = req.params;
  const {
    course_name,
    course_duration,
    card_overview,
    price,
    point_1,
    point_2,
    point_3,
    point_4,
    point_5,
    point_6,
    point_7
  } = req.body;
  const file = req.file;

  const client = await db.connect();

  try {
    await client.query('BEGIN');
    let imageUrl;

    // 🔹 Upload new image if provided
    if (file) {
      const blob = await put(`NystaicoursesImages/${file.originalname}`, file.buffer, {
        access: 'public',
        token: process.env.VERCEL_BLOB_RW_TOKEN,
        addRandomSuffix: true,
      });
      imageUrl = blob.url;
    }

    // 🔹 Check if course exists
    const courseCheck = await client.query(`SELECT * FROM nystaiallcourses WHERE id = $1`, [id]);
    if (courseCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // 🔹 Update course
    const courseQuery = `
      UPDATE nystaiallcourses
      SET 
        course_name = $1,
        course_duration = $2,
        card_overview = $3
        ${imageUrl ? ', image_url = $4' : ''}
      WHERE id = $${imageUrl ? 5 : 4}
      RETURNING *;
    `;
    const courseValues = imageUrl
      ? [course_name, course_duration, card_overview, imageUrl, id]
      : [course_name, course_duration, card_overview, id];

    const updatedCourse = await client.query(courseQuery, courseValues);

    // 🔹 Update linked pricing plan
    const planCheck = await client.query(`SELECT * FROM nystai_pricing_plans WHERE course_id = $1`, [id]);

    if (planCheck.rows.length > 0) {
      await client.query(
        `UPDATE nystai_pricing_plans SET
          plan_name = $1,
          price = $2,
          point_1 = $3,
          point_2 = $4,
          point_3 = $5,
          point_4 = $6,
          point_5 = $7,
          point_6 = $8,
          point_7 = $9
        WHERE course_id = $10`,
        [
          course_name,
          price,
          point_1,
          point_2,
          point_3,
          point_4,
          point_5,
          point_6,
          point_7,
          id
        ]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Course and pricing plan updated successfully',
      data: updatedCourse.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};




// Getting a Single Course
// This function Gets a Single Courses by their Own id
// export const getSingleCourse = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       "SELECT * FROM nystaiallcourses WHERE id = $1",
//       [parseInt(id)]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Course retrieved successfully",
//       data: result.rows
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Error retrieving course",
//       error: err.message
//     });
//   }
// };


export const getSingleCourseWithPlan = async (req, res, next) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        c.id AS course_id,
        c.course_name,
        c.course_duration,
        c.card_overview,
        c.image_url,
        p.id AS plan_id,
        p.price,
        p.point_1,
        p.point_2,
        p.point_3,
        p.point_4,
        p.point_5,
        p.point_6,
        p.point_7
      FROM nystaiallcourses c
      LEFT JOIN nystai_pricing_plans p
      ON c.id = p.course_id
      WHERE c.id = $1
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course and plan fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
