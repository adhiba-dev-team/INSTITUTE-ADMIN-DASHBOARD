import { body } from "express-validator";
import db from "../config/db.js";
import { validationResult } from "express-validator";
import multer from 'multer';

const validDomains = ["gmail.com", "yahoo.com", "outlook.com"];

export const tutorUpdateValidator = [

    body("first_name")
        .notEmpty().withMessage("First name is required").bail()
        .isLength({ min: 4, max: 30 }).withMessage('First name must be between 4 and 30 characters')
        .isAlpha().withMessage('Name must contain only letters'),

    body("last_name")
        .notEmpty().withMessage("Last name is required").bail()
        .isLength({ max: 4 }).withMessage("Last name must be at most 4 characters long")
        .matches(/^[A-Za-z\s]+$/).withMessage("Last name must contain only in letters"),

    body("dob")
        .notEmpty().withMessage("Date of birth is required").bail()
        .isISO8601().withMessage("Date of birth must be a valid date")
        .custom((value) => {
            const inputDate = new Date(value);
            const today = new Date();
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (inputDate > today) {
                throw new Error("Date of birth cannot be in the future");
            }
            return true;
        }),


    body("gender").bail().notEmpty().withMessage("Gender is required"),

    body("email")
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Invalid email format")
        .custom((value, { req }) => {
            const domain = value.split("@")[1];
            if (!validDomains.includes(domain)) {
                throw new Error("Only Gmail, Yahoo, and Outlook emails are allowed");
            }
            return true;
        }),
        
    body("phone")
        .notEmpty().withMessage("Phone number is required").bail()
        .isMobilePhone("en-IN").withMessage("Invalid phone number")
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number, Phone number must be 10 digits, starting with 6-9'),

    body("expertise").bail().notEmpty().withMessage("Expertise / Courses is required"),

    body("experience_years").bail()
        .notEmpty().withMessage("Experience is required"),

    body("joining_date").bail()
        .notEmpty().withMessage("Joining date is required")
        // .custom((value) => {
        //     const inputDate = new Date(value);
        //     const today = new Date();

        //     // Remove time to compare only date
        //     inputDate.setHours(0, 0, 0, 0);
        //     today.setHours(0, 0, 0, 0);

        //     if (inputDate.getTime() !== today.getTime()) {
        //         throw new Error("Joining date must be today");
        //     }

        //     return true;
        // })

];


export const handleUpdateTutorValidation = (req, res, next) => {
    const errors = validationResult(req);

    // ✅ All fields that we validate
    const fieldNames = [
        "first_name",
        "last_name",
        "dob",
        "gender",
        "email",
        "phone",
        "expertise",
        "experience_years",
        "joining_date"
    ];

    // ✅ Initialize all as success
    const fields = Object.fromEntries(
        fieldNames.map(name => [name, { success: true, msg: "" }])
    );

    // ❌ Mark the failed fields
    errors.array().forEach(err => {
        fields[err.path] = { success: false, msg: err.msg };
    });

    // 📌 If there are any validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, fields });
    }

    next();
};


// This is for Uploading Tutor Image Validation

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/heic',      
        'application/pdf' 
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, heic) or PDF documents'));
    }
};

export const uploadImageTutor = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});

export const checkTutorImageRequired = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            detail: "Tutor Image is required"
        });
    }
    next();
};


