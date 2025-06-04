import express from 'express'
import { getAllCourse, getCourseId, deleteCourse } from '../controllers/courseController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const courseRouter = express.Router()

// Get All Course
courseRouter.get('/all', getAllCourse)

// Get Course Data By Id
courseRouter.get('/:id', getCourseId)

// Delete Course By Id
courseRouter.delete('/:id', protectEducator, deleteCourse)

export default courseRouter;