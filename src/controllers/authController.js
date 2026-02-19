import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendVerificationEmail } from '../utils/mail.js'
import { RegisterSchema, LoginSchema, validateBody } from '../validators/schemas.js'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const styles = validateBody(RegisterSchema, req.body)
    if (!styles.success) {
        return res.status(422).json({ error: 'Validation failed', details: styles.errors })
    }

    const { name, email, password } = styles.data

    const userExists = await User.findOne({ email: email.toLowerCase() })

    if (userExists) {
        return res.status(409).json({ error: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
    })

    if (user) {
        try {
            await sendVerificationEmail(user.email, user.name, verificationToken)
        } catch (error) {
            console.error('Failed to send verification email:', error)
        }

        res.status(201).json({
            message: 'Account created! Please check your email.',
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400).json({ error: 'Invalid user data' })
    }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        if (!user.password) {
            console.log(`Login attempted for user ${email} who doesn't have a password set (Provider: ${user.provider})`)
            return res.status(401).json({ error: 'This account uses social login. Please sign in with Google.' })
        }

        if (await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                token: generateToken(user._id),
            })
        } else {
            res.status(401).json({ error: 'Invalid email or password' })
        }
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// @desc    Verify email
// @route   GET /api/auth/verify
// @access  Public
export const verifyEmail = async (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.status(400).json({ error: 'Invalid verification token' })
    }

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification link' })
    }

    user.emailVerified = new Date()
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    // Redirect to frontend login on success
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?message=Email verified successfully!`)
}
