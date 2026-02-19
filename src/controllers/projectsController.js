import Project from '../models/Project.js'
import { ProjectSchema, validateBody, ProjectUpdateSchema } from '../validators/schemas.js'

export const getProjects = async (req, res) => {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(projects)
}

export const createProject = async (req, res) => {
    const validation = validateBody(ProjectSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const project = await Project.create({ ...validation.data, userId: req.user._id })
    res.status(201).json(project)
}

export const getProjectById = async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id })
    if (project) {
        res.json(project)
    } else {
        res.status(404).json({ error: 'Project not found' })
    }
}

export const updateProject = async (req, res) => {
    const validation = validateBody(ProjectUpdateSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const project = await Project.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: validation.data },
        { new: true, runValidators: true }
    )

    if (project) {
        res.json(project)
    } else {
        res.status(404).json({ error: 'Project not found' })
    }
}

export const deleteProject = async (req, res) => {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (project) {
        res.json({ message: 'Project deleted' })
    } else {
        res.status(404).json({ error: 'Project not found' })
    }
}
