import JournalEntry from '../models/JournalEntry.js'
import { JournalEntrySchema, validateBody, JournalEntryUpdateSchema } from '../validators/schemas.js'

export const getEntries = async (req, res) => {
    const entries = await JournalEntry.find({ userId: req.user._id }).sort({ date: -1 })
    res.json(entries)
}

export const createEntry = async (req, res) => {
    const validation = validateBody(JournalEntrySchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const entry = await JournalEntry.create({ ...validation.data, userId: req.user._id })
    res.status(201).json(entry)
}

export const getEntryById = async (req, res) => {
    const entry = await JournalEntry.findOne({ _id: req.params.id, userId: req.user._id })
    if (entry) {
        res.json(entry)
    } else {
        res.status(404).json({ error: 'Journal entry not found' })
    }
}

export const updateEntry = async (req, res) => {
    const validation = validateBody(JournalEntryUpdateSchema, req.body)
    if (!validation.success) {
        return res.status(422).json({ error: 'Validation failed', details: validation.errors })
    }

    const entry = await JournalEntry.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: validation.data },
        { new: true, runValidators: true }
    )

    if (entry) {
        res.json(entry)
    } else {
        res.status(404).json({ error: 'Journal entry not found' })
    }
}

export const deleteEntry = async (req, res) => {
    const entry = await JournalEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (entry) {
        res.json({ message: 'Journal entry deleted' })
    } else {
        res.status(404).json({ error: 'Journal entry not found' })
    }
}
