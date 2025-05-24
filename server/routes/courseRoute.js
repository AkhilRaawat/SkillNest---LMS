import express from 'express'
import { getAllCourse, getCourseId } from '../controllers/courseController.js';


const courseRouter = express.Router()

// Get All Course
courseRouter.get('/all', getAllCourse)

// Get Course Data By Id
courseRouter.get('/:id', getCourseId)


export default courseRouter;