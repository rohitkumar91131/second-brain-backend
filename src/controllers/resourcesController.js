import Resource from '../models/Resource.js'
import { ResourceSchema, validateBody, ResourceUpdateSchema } from '../validators/schemas.js'

export const getResources = async (req, res) => {
    const resources = await Resource.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(resources)
}

export const createResource = async (req, res) => {
    const validation = validateBody(ResourceSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const resource = await Resource.create({ ...validation.data, userId: req.user._id })
    res.status(201).json(resource)
}

export const getResourceById = async (req, res) => {
    const resource = await Resource.findOne({ _id: req.params.id, userId: req.user._id })
    if (resource) {
        res.json(resource)
    } else {
        res.status(404).json({ error: 'Resource not found' })
    }
}

export const updateResource = async (req, res) => {
    const validation = validateBody(ResourceUpdateSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const resource = await Resource.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: validation.data },
        { new: true, runValidators: true }
    )

    if (resource) {
        res.json(resource)
    } else {
        res.status(404).json({ error: 'Resource not found' })
    }
}

export const deleteResource = async (req, res) => {
    const resource = await Resource.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (resource) {
        res.json({ message: 'Resource deleted' })
    } else {
        res.status(404).json({ error: 'Resource not found' })
    }
}
