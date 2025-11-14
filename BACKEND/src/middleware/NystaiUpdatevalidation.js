import { body, validationResult } from 'express-validator';


export const validateUpdateCourseInput = [
    body('course_name')
        .trim()
        .notEmpty().withMessage('Course name is required').bail()
        .matches(/^[A-Za-z\s]+$/).withMessage('Course name must contain only letters'),

    body('course_duration')
        .trim()
        .notEmpty().withMessage('Course duration is required').bail()
        .isInt({ min: 1, max: 365 }).withMessage('Course duration must be a number between 1 and 365'),

    body('card_overview')
        .trim()
        .notEmpty().withMessage('Card overview is required').bail()
        .custom((value) => {
            const wordCount = value.trim().split(/\s+/).length;
            if (wordCount > 150) {
                throw new Error('Card overview must not exceed 150 words');
            }
            return true;
        })
];

// export const handleUpdateValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     next();
// };


export const handleUpdateValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    const fieldNames = ["course_name", "course_duration", "card_overview"];

    // Initialize all fields as success: true
    const fieldsStatus = {};
    fieldNames.forEach(field => {
        fieldsStatus[field] = { success: true, msg: "" };
    });

    if (!errors.isEmpty()) {
        // Map validation errors into the field structure
        errors.array().forEach(err => {
            if (fieldsStatus[err.path]) {
                fieldsStatus[err.path] = { success: false, msg: err.msg };
            }
        });

        return res.status(400).json({
            success: false,
            fields: fieldsStatus
        });
    }

    next();
};