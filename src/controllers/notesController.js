import Note from '../models/Note.js'
import { NoteSchema, validateBody, NoteUpdateSchema } from '../validators/schemas.js'

export const getNotes = async (req, res) => {
    const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 })
    res.json(notes)
}

export const createNote = async (req, res) => {
    const validation = validateBody(NoteSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const note = await Note.create({ ...validation.data, userId: req.user._id })
    res.status(201).json(note)
}

export const getNoteById = async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id })
    if (note) {
        res.json(note)
    } else {
        res.status(404).json({ error: 'Note not found' })
    }
}

export const updateNote = async (req, res) => {
    const validation = validateBody(NoteUpdateSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: validation.data },
        { new: true, runValidators: true }
    )

    if (note) {
        res.json(note)
    } else {
        res.status(404).json({ error: 'Note not found' })
    }
}

export const deleteNote = async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (note) {
        res.json({ message: 'Note deleted' })
    } else {
        res.status(404).json({ error: 'Note not found' })
    }
}
