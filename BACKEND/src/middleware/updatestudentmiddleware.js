import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';

export const validateUpdateStudentCourse = [

  body('name')
    .trim()
    .isLength({ min: 4, max: 30 }).withMessage('Name must be between 4 and 30 characters')
    .isAlpha().withMessage('Name must contain only letters'),

  body('last_name')
    .trim()
    .isLength({ max: 4 }).withMessage("Last name must be at most 4 characters long")
    .isAlpha().withMessage('Last name must contain only letters')
    .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only in letters"),

  body("last_name")
    .trim()
    .notEmpty().withMessage("Last name is required").bail()

  ,

  body('dob')
    .trim()
    .notEmpty().withMessage('Date of birth is required')
    .custom((value) => {
      // Check if it's a valid date
      const parsed = Date.parse(value);
      if (isNaN(parsed)) {
        throw new Error('Date of birth must be a valid date');
      }

      // Age validation
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (actualAge < 21) {
        throw new Error('Student must be at least 21 years old');
      }

      return true;
    }),


  body('gender')
    .trim()
    .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender option'),

  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .matches(/@(?:gmail\.com|yahoo\.com|outlook\.com|.+\.org)$/)
    .withMessage('Only gmail.com, yahoo.com, outlook.com, or .org emails are allowed')
    .custom(async (value, { req }) => {
      const { rows } = await pool.query(
        'SELECT email FROM studentspersonalinformation WHERE email = $1 AND student_id != $2',
        [value, req.params.student_id]
      );
      if (rows.length > 0) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  body('phone')
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number, Phone number must be 10 digits, starting with 6-9')
    .custom(async (value, { req }) => {
      const { rows } = await pool.query(
        'SELECT phone FROM studentspersonalinformation WHERE phone = $1 AND student_id != $2',
        [value, req.params.student_id]
      );
      if (rows.length > 0) {
        throw new Error('Phone already exists');
      }
      return true;
    }),


  body('alt_phone')
    .trim()
    .isMobilePhone('en-IN').withMessage('Invalid alternate phone number, must be 10 digits, starting with 6-9')
    .custom(async (value, { req }) => {
      const { rows } = await pool.query(
        'SELECT alt_phone FROM studentspersonalinformation WHERE alt_phone = $1 AND student_id != $2',
        [value, req.params.student_id]
      );
      if (rows.length > 0) {
        throw new Error('Alternate phone number already exists');
      }
      return true;
    }),


  body('aadhar_number')
    .trim()
    .isLength({ min: 12, max: 12 }).withMessage('Aadhar must be 12 digits')
    .matches(/^\d{12}$/).withMessage('Aadhar must contain only 12 numeric digits')
    .custom(async (value, { req }) => {
      const { rows } = await pool.query(
        'SELECT aadhar_number FROM studentspersonalinformation WHERE aadhar_number = $1 AND student_id != $2',
        [value, req.params.student_id]
      );
      if (rows.length > 0) throw new Error('Aadhar already exists');
      return true;
    }),

  body('pan_number')
    .trim()
    .isAlphanumeric().withMessage('PAN number must be alphanumeric')
    .isLength({ min: 10, max: 10 }).withMessage('PAN must be 10 characters'),

  body('pincode')
    .trim()
    .matches(/^[1-9][0-9]{5}$/).withMessage('Pincode must be a 6-digit number starting from 1 to 9')
    .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits'),

  body('address')
    .trim(),

  body('state')
    .trim(),

  // Course Info (Optional)
  body('department')
    .trim(),

  body('course')
    .trim(),

  body('year_of_passed')
    .trim(),

  body('experience')
    .trim(),

  body('department_stream')
    .trim(),

  body('course_duration')
    .trim(),

  body('join_date')
    .trim(),

  body('end_date')
    .trim(),

  body('course_enrolled')
    .trim(),

  body('batch')
    .trim(),

  body('tutor')
    .trim(),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

