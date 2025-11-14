import express from "express";
import { addtutor, deletetutor, getalltutors, getsingletutor, updatetutor } from "../controllers/tutorController.js";
import multer from 'multer';
import { tutorInputValidator, handleInputTutorValidation } from "../middleware/tutorValidator.js";
import { checkTutorImageRequired, uploadImageTutor } from "../middleware/tutorUpdateValidator.js";
import { handleUpdateTutorValidation, tutorUpdateValidator } from "../middleware/tutorUpdateValidator.js";

const upload = multer();

const router = express.Router();

// POST 
router.post("/addtutor", uploadImageTutor.single("tutor_image"), checkTutorImageRequired, tutorInputValidator, handleInputTutorValidation, addtutor);

// Update single tutor
router.put("/updatetutor/:id", uploadImageTutor.single("tutor_image"), tutorUpdateValidator, handleUpdateTutorValidation, updatetutor);

// Get all tutors
router.get("/getalltutors", getalltutors);

// Get single Student
router.get("/gettutor/:id", getsingletutor);

// This is for Delete a Single Tutor
router.delete("/deletetutor/:id", deletetutor);


export default router;
