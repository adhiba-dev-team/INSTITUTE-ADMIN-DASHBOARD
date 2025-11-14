import db from '../config/db.js';
import { validationResult } from 'express-validator';



// Adding a new pricing plan
// This function handles the addition of a new pricing plan to the database
// export const addPricingPlan = async (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             errors: errors.array().map(err => ({
//                 field: err.param,
//                 message: err.msg
//             }))
//         });
//     }

//     const {
//         plan_name,
//         price,
//         point_1,
//         point_2,
//         point_3,
//         point_4,
//         point_5,
//         point_6,
//         point_7
//     } = req.body;

//     try {
//         // Check for duplicate plan_name + price
//         const existing = await db.query(
//             `SELECT * FROM nystai_pricing_plans WHERE plan_name = $1 AND price = $2`,
//             [plan_name, price]
//         );

//         if (existing.rows.length > 0) {
//             return res.status(409).json({ message: 'This pricing plan already exists' });
//         }

//         const result = await db.query(
//             `INSERT INTO nystai_pricing_plans
//              (plan_name, price, point_1, point_2, point_3, point_4, point_5, point_6, point_7)
//              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//              RETURNING *`,
//             [
//                 plan_name,
//                 price,
//                 point_1,
//                 point_2,
//                 point_3,
//                 point_4,
//                 point_5,
//                 point_6,
//                 point_7
//             ]
//         );

//         res.status(201).json({
//             message: 'Pricing plan added successfully',
//             data: result.rows[0]
//         });
//     } catch (err) {
//         next(err);
//     }
// };





// Fetching all pricing plans
// This function retrieves all pricing plans from the database
// export const getAllPricingPlans = async (req, res, next) => {
//     try {
//         const result = await db.query('SELECT * FROM nystai_pricing_plans ORDER BY id DESC');

//         res.status(200).json({
//             success: true,
//             message: 'Pricing plans fetched successfully',
//             data: result.rows
//         });

//     } catch (err) {
//         next(err);
//     }
// };


// Updating an existing pricing plan
// This function updates a specific pricing plan based on its ID
// export const updatePricingPlan = async (req, res, next) => {
//     const { id } = req.params;
//     const {
//         plan_name,
//         price,
//         point_1,
//         point_2,
//         point_3,
//         point_4,
//         point_5,
//         point_6,
//         point_7
//     } = req.body;

//     try {
//         const check = await db.query('SELECT * FROM nystai_pricing_plans WHERE id = $1', [id]);

//         if (check.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Pricing plan not found'
//             });
//         }

//         const result = await db.query(
//             `UPDATE nystai_pricing_plans SET
//              plan_name = $1,
//              price = $2,
//              point_1 = $3,
//              point_2 = $4,
//              point_3 = $5,
//              point_4 = $6,
//              point_5 = $7,
//              point_6 = $8,
//              point_7 = $9
//              WHERE id = $10
//              RETURNING *`,
//             [
//                 plan_name,
//                 price,
//                 point_1,
//                 point_2,
//                 point_3,
//                 point_4,
//                 point_5,
//                 point_6,
//                 point_7,
//                 id
//             ]
//         );

//         // If somehow nothing was updated
//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Pricing plan not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Pricing plan updated successfully',
//             data: result.rows[0]
//         });

//     } catch (err) {
//         next(err);
//     }
// };



// Deleting a pricing plan
// This function deletes a specific pricing plan based on its ID
// export const deletePricingPlan = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         // Check if the pricing plan exists
//         const check = await db.query('SELECT * FROM nystai_pricing_plans WHERE id = $1', [id]);

//         if (check.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Pricing plan not found'
//             });
//         }

//         // Delete the plan
//         await db.query('DELETE FROM nystai_pricing_plans WHERE id = $1', [id]);

//         res.status(200).json({
//             success: true,
//             message: 'Pricing plan deleted successfully'
//         });

//     } catch (err) {
//         next(err);
//     }
// };


// Getting a pricing plan
// This function Gets a specific pricing plan based on its ID
// export const getsingleplan = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         const result = await db.query("SELECT * FROM nystai_pricing_plans WHERE id = $1", [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Plan not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Plan fetched successfully",
//             plan: result.rows[0],
//         });

//     } catch (error) {
//         next(error);
//     }
// };
