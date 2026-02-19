import Task from '../models/Task.js'
import { TaskSchema, validateBody, TaskUpdateSchema } from '../validators/schemas.js'

export const getTasks = async (req, res) => {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(tasks)
}

export const createTask = async (req, res) => {
    const validation = validateBody(TaskSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const task = await Task.create({ ...validation.data, userId: req.user._id })
    res.status(201).json(task)
}

export const getTaskById = async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id })
    if (task) {
        res.json(task)
    } else {
        res.status(404).json({ error: 'Task not found' })
    }
}

export const updateTask = async (req, res) => {
    const validation = validateBody(TaskUpdateSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: validation.data },
        { new: true, runValidators: true }
    )

    if (task) {
        res.json(task)
    } else {
        res.status(404).json({ error: 'Task not found' })
    }
}

export const deleteTask = async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (task) {
        res.json({ message: 'Task deleted' })
    } else {
        res.status(404).json({ error: 'Task not found' })
    }
}
