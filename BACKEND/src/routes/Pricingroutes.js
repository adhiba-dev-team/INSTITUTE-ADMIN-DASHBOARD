import express from 'express';
import multer from 'multer';
import { handleUpdatePricingPlanValidationErrors, validateUpdatePricingPlan } from '../middleware/pricingplanupdatevalidation.js';
const upload = multer();


const router = express.Router();

// router.post('/add-pricing-plan',
//     upload.none(),
//     validateInputPricingPlan,
//     handleInputPricingPlanValidationErrors,
//     addPricingPlan
// );


// router.get('/all-pricing-plans', getAllPricingPlans);

// router.put('/update-pricing-plan/:id', upload.none(), validateUpdatePricingPlan, handleUpdatePricingPlanValidationErrors, updatePricingPlan);

// router.delete('/delete-pricing-plan/:id', deletePricingPlan);

// router.get("/single-plan/:id", getsingleplan);


export default router;
