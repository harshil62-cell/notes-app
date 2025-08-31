/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

/**
 * @swagger
 * /api/notes/create-note:
 *   post:
 *     summary: Create a new note for the authenticated user
 *     description: Creates a new note for the authenticated user. Requires JWT authentication.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Title or content missing
 */

/**
 * @swagger
 * /api/notes/get-notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     description: Returns all notes belonging to the authenticated user, sorted by creation date (newest first).
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 */

/**
 * @swagger
 * /api/notes/delete-note/{id}:
 *   delete:
 *     summary: Delete a note by ID for the authenticated user
 *     description: Deletes a note by its ID for the authenticated user. Only deletes notes belonging to the requesting user.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */

const express = require('express');
const { createNote, deleteNote, getAllNotes } = require('../controllers/note-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/create-note', authMiddleware, createNote);
router.delete('/delete-note/:id', authMiddleware, deleteNote);
router.get('/get-notes', authMiddleware, getAllNotes);

module.exports = router;