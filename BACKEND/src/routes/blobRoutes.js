import express from 'express';
import { uploadFields } from '../middleware/uploadMiddleware.js';
import { deleteStudent, getAllStudents, getCompletedStudentsCount, getCourseStudentCount, getLastSixMonthsStudentCount, getStudentById, getStudentQR, getStudentsCount, getStudentsCountByCourse, insertStudentWithProof, updateStudentWithProof } from '../controllers/blobController.js';
import { handleValidationstudentInsert, validateStudent } from '../middleware/validateStudent.js';
import { validateUpdateStudentCourse } from '../middleware/updatestudentmiddleware.js';


const router = express.Router();

//  Insert student route with multiple file uploads
router.post('/insert-student',
    uploadFields,
    validateStudent,
    handleValidationstudentInsert,
    insertStudentWithProof
);

//  Get all students
router.get('/get-all-students', getAllStudents);

//  Update student with file uploads
router.put('/update-student/:student_id', uploadFields, validateUpdateStudentCourse, updateStudentWithProof);

// Delete student route
router.delete('/students/:id', deleteStudent);

// Get student by ID
router.get('/single-student/:student_id', getStudentById);

// Student routes
router.get('/students-count', getStudentsCount);

// Get completed student count
router.get('/get-completed-students-count', getCompletedStudentsCount);

// get course student count
router.get("/count/:course_enrolled", getCourseStudentCount);

// Pie chart API - Students count per course
router.get("/students/course-counts", getStudentsCountByCourse);

//  Bar chart API: student counts grouped by month
router.get("/students/last-six-months", getLastSixMonthsStudentCount);

// GET single student's QR
router.get("/student-qr/:student_id", getStudentQR);

export default router;
