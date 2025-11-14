import { body } from 'express-validator';
import pool from '../config/db.js';
import { validationResult } from 'express-validator';

export const validateStudent = [

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required').bail()
        .isLength({ min: 4, max: 50 }).withMessage('First name must be between 4 and 50 characters')
        .isAlpha().withMessage('Name must contain only letters'),

    body('last_name')
        .trim()
        .notEmpty().withMessage('Last name is required').bail()
        .isLength({ max: 4 }).withMessage("Last name must be at most 4 characters long")
        .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only in letters"),

    body('dob')
        .trim()
        .notEmpty().withMessage('Date of birth is required').bail()
        .custom((value) => {
            const parsedDate = Date.parse(value);
            if (isNaN(parsedDate)) {
                throw new Error('Date of birth must be a valid date');
            }
            return true;
        })
        .custom((value) => {
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
        .notEmpty().withMessage('Gender is required').bail()
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender option'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Invalid email address')
        .matches(/@(?:gmail\.com|yahoo\.com|outlook\.com|.+\.org)$/)
        .withMessage('Only gmail.com, yahoo.com, outlook.com, or .org emails are allowed')
        .custom(async (value) => {
            const { rows } = await pool.query(
                'SELECT email FROM studentspersonalinformation WHERE email = $1',
                [value]
            );
            if (rows.length > 0) {
                throw new Error('Email already registered');
            }
            return true;
        }),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required').bail()
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number,Phone Number must be 10 digits, starting with 6-9')
        .custom(async (value) => {
            const { rows } = await pool.query(
                'SELECT phone FROM studentspersonalinformation WHERE phone = $1',
                [value]
            );
            if (rows.length > 0) {
                throw new Error('Phone number already registered');
            }
            return true;
        }),


    body('alt_phone')
        .trim()
        .notEmpty().withMessage('Phone number is required').bail()
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid alternate phone number, must be 10 digits, starting with 6-9')
        .custom(async (value) => {
            const { rows } = await pool.query(
                'SELECT alt_phone FROM studentspersonalinformation WHERE alt_phone = $1',
                [value]
            );
            if (rows.length > 0) {
                throw new Error('Alternate phone already registered');
            }
            return true;
        }),


    body('aadhar_number')
        .trim()
        .notEmpty().withMessage('Aadhar number is required').bail()
        .matches(/^\d{12}$/).withMessage('Aadhar must contain only 12 numeric digits')
        .isLength({ min: 12, max: 12 }).withMessage('Aadhar must be 12 digits')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT aadhar_number FROM studentspersonalinformation WHERE aadhar_number = $1', [value]);
            if (rows.length > 0) {
                throw new Error('Aadhar already registered');
            }
            return true;
        }),

    body('pan_number')
        .trim()
        .notEmpty().withMessage('PAN number is required').bail()
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage('PAN must be 10 characters')
        .custom(async (value) => {
            const { rows } = await pool.query('SELECT pan_number FROM studentspersonalinformation WHERE pan_number = $1', [value]);
            if (rows.length > 0) {
                throw new Error('PAN number already registered');
            }
            return true;
        }),

    body('address')
        .trim().bail()
        .notEmpty().withMessage('Address is required'),

    body('pincode')
        .trim()
        .notEmpty().withMessage('Pincode is required').bail()
        .matches(/^[1-9][0-9]{5}$/).withMessage('Pincode must be a 6-digit number starting from 1 to 9')
        .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits'),

    body('state')
        .trim().bail()
        .notEmpty().withMessage('State is required'),

    // Course Info
    body('department')
        .trim().bail()
        .notEmpty().withMessage('Department is required'),

    body('course')
        .trim().bail()
        .notEmpty().withMessage('Course is required'),

    body('year_of_passed')
        .trim().bail()
        .notEmpty().withMessage('Year of passed is required'),

    body('experience')
        .trim().bail()
        .notEmpty().withMessage('Experience is required'),

    body('department_stream')
        .trim().bail()
        .notEmpty().withMessage('Department stream is required'),

    body('course_duration')
        .trim().bail()
        .notEmpty().withMessage('Course duration is required'),

    body('join_date')
        .trim().bail()
        .notEmpty().withMessage('Join date is required'),

    body('end_date')
        .trim().bail()
        .notEmpty().withMessage('End date is required'),

    body('course_enrolled')
        .trim().bail()
        .notEmpty().withMessage('Course enrolled is required'),

    body('batch')
        .trim().bail()
        .notEmpty().withMessage('Batch is required'),

    body('tutor')
        .trim().bail()
        .notEmpty().withMessage('Tutor is required'),


];


export const handleValidationstudentInsert = (req, res, next) => {
    const errors = validationResult(req);

    // All fields we expect
    const expectedFields = [
        "name",
        "last_name",
        "dob",
        "gender",
        "email",
        "phone",
        "alt_phone",
        "aadhar_number",
        "pan_number",
        "address",
        "pincode",
        "state",
        "department",
        "course",
        "year_of_passed",
        "experience",
        "department_stream",
        "course_duration",
        "join_date",
        "end_date",
        "course_enrolled",
        "batch",
        "tutor",
    ];

    // Initialize all as success
    const fields = Object.fromEntries(
        expectedFields.map(name => [name, { success: true, msg: "" }])
    );

    // Mark failed fields
    errors.array().forEach(err => {
        fields[err.path] = { success: false, msg: err.msg };
    });

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, fields });
    }

    next();
};
