const Note = require('../models/Note');

const createNote = async (req, res) => {
    try {
        // Get the userId directly from the trusted JWT payload.
        // The middleware already confirms the user exists.
        const userId = req.userInfo.userId;

        const { title, content } = req.body;

        // Use 400 for Bad Request (missing data), and check for either field.
        if (!title || !content) {
            return res.status(400).json({ // FIX: Added 'return' and changed to 400
                success: false,
                message: 'Title and content are required'
            });
        }

        const note = new Note({
            userId, // This is the user's _id from the token
            title,
            content,
        });

        await note.save();

        res.status(201).json({
            success: true,
            message: `Note created successfully for user ${userId}`,
            note: note,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again!'
        })
    }
};

const deleteNote = async (req, res) => {
    try {
        const { id: noteId } = req.params;

        // FIX: Changed from .id to .userId to match JWT payload
        const userId = req.userInfo.userId;

        const note = await Note.findOneAndDelete({ _id: noteId, userId: userId });

        if (!note) {
            // FIX: Added 'return'
            return res.status(404).json({
                success: false,
                message: 'Note not found or you do not have permission to delete it'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });

    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
             // FIX: Added 'return'
            return res.status(400).json({
                success: false,
                message: 'Invalid note ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const userIdFromToken = req.userInfo.userId;
        const notes = await Note.find({ userId: userIdFromToken }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            notes: notes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again!'
        });
    }
};

module.exports = {
    createNote,
    deleteNote,
    getAllNotes,
};