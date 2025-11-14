// ✅ uploadCertificate.js (middleware)
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/heic",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, HEIC, or PDF files are allowed"));
  }
};

export const uploadCertificate = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

// ✅ Check if file exists
export const checkCertificatemiddleware = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: "Certificate file is required",
    });
  }
  next();
};
