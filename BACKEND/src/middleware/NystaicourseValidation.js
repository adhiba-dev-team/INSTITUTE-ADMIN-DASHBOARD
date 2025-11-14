import { body, validationResult } from 'express-validator';
import multer from 'multer';

export const validateInsertCourseInput = [
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


export const handleInsertValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // Build default structure from body keys
  const fields = {};
  Object.keys(req.body).forEach(key => {
    fields[key] = { success: true, msg: "" };
  });

  if (!errors.isEmpty()) {
    errors.array().forEach(err => {
      if (fields[err.path] !== undefined) {
        fields[err.path] = { success: false, msg: err.msg };
      }
    });

    return res.status(400).json({
      success: false,
      fields
    });
  }

  next();
};




// Storage not needed since we're using buffer (not disk)
const storage = multer.memoryStorage();

// File type check
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

// Max file size: 2MB = 2 * 1024 * 1024
export const NystaiCourseuploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});
