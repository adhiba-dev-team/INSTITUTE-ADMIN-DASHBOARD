// import express from 'express';
// import cors from 'cors';

// import blobRoutes from './src/routes/blobRoutes.js';
// import errorHandler from './src/middleware/errorHandler.js';
// import authRoutes from './src/routes/authRoutes.js';
// import Nystaicoursesroutes from './src/routes/Nystaicoursesroutes.js';
// import pricingPlanRoutes from './src/routes/Pricingroutes.js';
// import tutorRoutes from './src/routes/tutorRoutes.js';
// import StudentTasks from './src/routes/assignTaskroutes.js'

// const app = express();
// app.use(cors({
//   origin: ["http://localhost:5173", "https://your-frontend.vercel.app"], 
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true })); 

// app.use('/', blobRoutes);
// app.use('/AdminorTutor', authRoutes);
// app.use('/Allcourses', Nystaicoursesroutes);
// app.use('/pricing-plans', pricingPlanRoutes);
// app.use('/NystaiTutors', tutorRoutes)
// app.use('/Students-Tasks', StudentTasks)



// app.use(errorHandler)


// app.use((err, req, res, next) => {
//   res.status(500).json({ error: err.message || 'Server error' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// NEW INDEXJS (OLD ALSO WORKING)

import express from 'express';
import cors from 'cors';
// other imports...
import blobRoutes from './src/routes/blobRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/authRoutes.js';
import Nystaicoursesroutes from './src/routes/Nystaicoursesroutes.js';
import pricingPlanRoutes from './src/routes/Pricingroutes.js';
import tutorRoutes from './src/routes/tutorRoutes.js';
import StudentTasks from './src/routes/assignTaskroutes.js'
import certificateroutes from './src/routes/certificateroutes.js';

const app = express();

const whitelist = ["http://localhost:5173", "https://admin-nystai-dashboard.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', blobRoutes);
app.use('/AdminorTutor', authRoutes);
app.use('/Allcourses', Nystaicoursesroutes);
app.use('/pricing-plans', pricingPlanRoutes);
app.use('/NystaiTutors', tutorRoutes);
app.use('/Students-Tasks', StudentTasks);
app.use('/studentscertificates', certificateroutes);

// Use only one error handler - your custom one or inline
app.use(errorHandler);

// If you want an inline fallback, you can keep this instead of errorHandler
/*
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server error' });
});
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));