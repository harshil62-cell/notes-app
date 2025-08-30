const express=require('express');
const{createNote,deleteNote,getAllNotes}=require('../controllers/note-controller');
const authMiddleware=require('../middlewares/auth-middleware');
const router=express.Router();

router.post('/create-note',authMiddleware,createNote);
router.delete('/delete-note/:id',authMiddleware,deleteNote);
router.get('/get-notes',authMiddleware,getAllNotes);

module.exports=router;