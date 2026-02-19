import express from 'express'
import { getProjects, createProject, getProjectById, updateProject, deleteProject } from '../controllers/projectsController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject)

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject)

export default router
