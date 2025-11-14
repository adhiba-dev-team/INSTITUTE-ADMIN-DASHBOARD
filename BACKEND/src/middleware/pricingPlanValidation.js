import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const validateInputPricingPlan = [
  body('plan_name')
    .trim()
    .bail()
    .notEmpty().withMessage('Plan name is required')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Plan name must not contain special characters'),

  body('price')
    .trim()
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a valid number'),

  body('point_1')
    .trim()
    .notEmpty().withMessage('Point 1 is required'),
  body('point_2')
    .trim()
    .notEmpty().withMessage('Point 2 is required'),
  body('point_3')
    .trim()
    .notEmpty().withMessage('Point 3 is required'),
  body('point_4')
    .trim()
    .notEmpty().withMessage('Point 4 is required'),
  body('point_5')
    .trim()
    .notEmpty().withMessage('Point 5 is required'),

  body('point_6')
    .optional()
    .trim(),
  body('point_7')
    .optional()
    .trim()
];

export const handleInputPricingPlanValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // ✅ Fields we validate
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

  // ✅ Initialize all fields as success
  const fields = Object.fromEntries(
    fieldNames.map(name => [name, { success: true, msg: "" }])
  );

  // ❌ Update fields that failed validation
  errors.array().forEach(err => {
    fields[err.path] = { success: false, msg: err.msg };
  });

  // 📌 If validation errors exist
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      fields
    });
  }

  next();
};