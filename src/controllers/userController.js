import User from '../models/User.js'
import { ProfileUpdateSchema, validateBody } from '../validators/schemas.js'

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            provider: user.provider,
            viewPreferences: user.viewPreferences || {},
            createdAt: user.createdAt,
        })
    } else {
        res.status(404).json({ error: 'User not found' })
    }
}

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const validation = validateBody(ProfileUpdateSchema, req.body)
        if (!validation.success) {
            return res.status(422).json({ error: 'Validation failed', details: validation.errors })
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: validation.data },
            { new: true, runValidators: true }
        )

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            viewPreferences: updatedUser.viewPreferences || {},
        })
    } else {
        res.status(404).json({ error: 'User not found' })
    }
}
