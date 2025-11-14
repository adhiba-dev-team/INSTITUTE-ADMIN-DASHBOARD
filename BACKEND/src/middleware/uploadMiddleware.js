import multer from 'multer';

// Store files in memory
const storage = multer.memoryStorage();

// Allowed file types
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'application/pdf'
];

// File validation logic
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    return cb(new Error(' Video files are not allowed'));
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only PDF and image files (JPG, PNG, HEIC) are allowed'));
  }

  cb(null, true);
};

// Multer setup with 2MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Accept these 4 fields with max 1 file each
export const uploadFields = upload.fields([
  { name: 'passport_photo', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 },
  { name: 'aadhar_card', maxCount: 1 },
  { name: 'sslc_marksheet', maxCount: 1 }
]);

// Optional export if you ever want to accept any field
const uploadAny = upload.any();
export default uploadAny;

// Custom middleware to validate uploaded files
// This middleware checks if the required files are present in the request
export const validateUploadedFiles = (req, res, next) => {
  const requiredFields = ['passport_photo', 'pan_card', 'aadhar_card', 'sslc_marksheet'];
  const errors = [];

  for (const field of requiredFields) {
    if (!req.files || !req.files[field] || req.files[field].length === 0) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
