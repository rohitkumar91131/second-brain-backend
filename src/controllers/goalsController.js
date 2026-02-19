import Goal from '../models/Goal.js'
import { GoalSchema, validateBody, GoalUpdateSchema } from '../validators/schemas.js'

export const getGoals = async (req, res) => {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(goals)
}

export const createGoal = async (req, res) => {
    const validation = validateBody(GoalSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const goal = await Goal.create({ ...validation.data, userId: req.user._id })
    res.status(201).json(goal)
}

export const getGoalById = async (req, res) => {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id })
    if (goal) {
        res.json(goal)
    } else {
        res.status(404).json({ error: 'Goal not found' })
    }
}

export const updateGoal = async (req, res) => {
    const validation = validateBody(GoalUpdateSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const goal = await Goal.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: validation.data },
        { new: true, runValidators: true }
    )

    if (goal) {
        res.json(goal)
    } else {
        res.status(404).json({ error: 'Goal not found' })
    }
}

export const deleteGoal = async (req, res) => {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (goal) {
        res.json({ message: 'Goal deleted' })
    } else {
        res.status(404).json({ error: 'Goal not found' })
    }
}
