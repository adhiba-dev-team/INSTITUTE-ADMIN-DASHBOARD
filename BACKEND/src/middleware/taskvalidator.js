import { body } from "express-validator";
import db from "../config/db.js";
import { validationResult } from "express-validator";


export const AssignTaskInputValidator = [

    body("batch")
        .trim()
        .bail()
        .notEmpty().withMessage("Batch is required"),

    body("course")
        .trim()
        .bail()
        .notEmpty().withMessage("Coursee is required"),

    body("task_title")
        .trim()
        .bail()
        .notEmpty().withMessage("Task Title is required"),


    body("task_description")
        .trim()
        .bail()
        .notEmpty().withMessage("Task Description is required"),

    body("due_date")
        .trim()
        .bail()
        .notEmpty().withMessage("Due date is required")
        .custom((value) => {
            const inputDate = new Date(value);
            const today = new Date();

            // Remove time to compare only date
            inputDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                throw new Error("Due date cannot be in the past");
            }

            return true;
        })


];


export const handleAssignTaskValidation = (req, res, next) => {
    const errors = validationResult(req);

    // All fields we expect
    const fieldNames = [
        "batch",
        "course",
        "task_title",
        "task_description",
        "due_date"
    ];

    // Initialize all as success
    const fields = Object.fromEntries(
        fieldNames.map(name => [name, { success: true, msg: "" }])
    );

    // Mark failed fields
    errors.array().forEach(err => {
        fields[err.path] = { success: false, msg: err.msg };
    });

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, fields });
    }

    next();
};




