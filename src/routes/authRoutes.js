import express from 'express'
import { registerUser, authUser, verifyEmail } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', authUser)
router.get('/verify', verifyEmail)

export default router
