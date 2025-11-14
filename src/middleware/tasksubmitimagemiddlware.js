import multer from 'multer';

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
export const NystaiTaskuploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});