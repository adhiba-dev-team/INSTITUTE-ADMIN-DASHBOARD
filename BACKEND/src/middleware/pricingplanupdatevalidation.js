import { body, validationResult } from "express-validator";

export const validateUpdatePricingPlan = [
  body('plan_name')
    .trim()
    .bail()
    .notEmpty().withMessage('Plan name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Plan name must not contain special characters'),

  body("price")
    .trim()
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a valid number"),

  body("point_1")
    .trim()
    .notEmpty().withMessage("Point 1 is required"),
  body("point_2")
    .trim()
    .notEmpty().withMessage("Point 2 is required"),
  body("point_3")
    .trim()
    .notEmpty().withMessage("Point 3 is required"),
  body("point_4")
    .trim()
    .notEmpty().withMessage("Point 4 is required"),
  body("point_5")
    .trim()
    .notEmpty().withMessage("Point 5 is required"),

  body("point_6")
    .optional()
    .trim(),
  body("point_7")
    .optional()
    .trim()
];

export const handleUpdatePricingPlanValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // ✅ All validated fields
  const fieldNames = [
    "plan_name",
    "price",
    "point_1",
    "point_2",
    "point_3",
    "point_4",
    "point_5",
    "point_6",
    "point_7"
  ];

  // ✅ Initialize all as success
  const fields = Object.fromEntries(
    fieldNames.map(name => [name, { success: true, msg: "" }])
  );

  // ❌ Mark the failed fields
  errors.array().forEach(err => {
    fields[err.path] = { success: false, msg: err.msg };
  });

  // 📌 If there are validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, fields });
  }

  next();
};
