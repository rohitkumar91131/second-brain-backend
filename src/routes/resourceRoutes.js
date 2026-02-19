import express from 'express'
import { getResources, createResource, getResourceById, updateResource, deleteResource } from '../controllers/resourcesController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(protect, getResources)
    .post(protect, createResource)

router.route('/:id')
    .get(protect, getResourceById)
    .put(protect, updateResource)
    .delete(protect, deleteResource)

export default router
