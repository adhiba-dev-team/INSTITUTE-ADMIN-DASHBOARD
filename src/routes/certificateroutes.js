// backend/routes/certificateRoutes.js
import express from "express";
import multer from "multer";
import { deleteCertificateImageForStudent, getCertificateForStudent, updateCertificateForStudent, uploadCertificateForStudent, verifyCertificate } from "../controllers/certificateController.js";
import { checkCertificatemiddleware, uploadCertificate } from "../middleware/certificateuploadsmiddleware.js";

const router = express.Router();
const upload = multer(); // memory storage for single file

// Verify certificate (login page)
router.post("/verify", upload.none(), verifyCertificate);

// ✅ Upload certificate
router.post("/:studentId/upload", uploadCertificate.single("certificate"), checkCertificatemiddleware, uploadCertificateForStudent);

// GET certificate for a student
router.get("/:studentId", getCertificateForStudent);

// Update certificate for a student
router.put("/:studentId", uploadCertificate.single("certificate"), checkCertificatemiddleware, updateCertificateForStudent);

// Delete certificate for a student
router.delete("/:studentId", deleteCertificateImageForStudent);


export default router;
