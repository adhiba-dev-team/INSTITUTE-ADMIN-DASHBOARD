import express from 'express';
import { addCourseWithPlan, deleteCourseWithPlan, getAllCoursesWithPlans, getSingleCourseWithPlan, updateCourseWithPlan } from '../controllers/Nystaiallcourses.js';
import multer from 'multer';
import { handleInsertValidationErrors, NystaiCourseuploadImage, validateInsertCourseInput } from '../middleware/NystaicourseValidation.js';
import { handleUpdateValidationErrors, validateUpdateCourseInput } from '../middleware/NystaiUpdatevalidation.js';


const storage = multer.memoryStorage();

const router = express.Router();

// router.post(
//     '/add',
//     NystaiCourseuploadImage.single('image_url'),
//     validateInsertCourseInput,
//     handleInsertValidationErrors,
//     Addingcourses
// );

// router.get('/get-all-courses', getAllCourses);

// router.delete('/delete-course/:id', deleteCourse);

// router.get('/get-course/:id', getSingleCourse);

// router.put('/update-courses/:id', NystaiCourseuploadImage.single('image_url'), validateUpdateCourseInput, handleUpdateValidationErrors, updateCourse);

router.post('/add-course-with-plan', NystaiCourseuploadImage.single('image_url'), validateInsertCourseInput, handleInsertValidationErrors, addCourseWithPlan);

router.get('/all-courses-with-plans', getAllCoursesWithPlans);

router.get('/get-course-with-plan/:id', getSingleCourseWithPlan);

router.delete('/delete-course-with-plan/:id', deleteCourseWithPlan);

router.put('/update-course-with-plan/:id', NystaiCourseuploadImage.single('image_url'), validateUpdateCourseInput, handleUpdateValidationErrors, updateCourseWithPlan);




export default router;