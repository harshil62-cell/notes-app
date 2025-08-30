const Note=require('../models/Note');
const User=require('../models/User');

const createNote=async(req,res)=>{
    try {
        const userId=req.userInfo.id;
        let user=await User.findOne({userId}); 
        if(!user){
            res.status(401).json({
                success:false,
                message:'Access denied'
            });
        }
        const{title,content}=req.body;
        if(!title && !content){
            res.status(401).json({
                success:false,
                message:'title and content of note is required'
            });
        }
        const note=new Note({
            userId:user._id,
            title,
            content,
        });

        await note.save();

        res.status(201).json({
            success:true,
            message:`note created successfully for ${user._id}`,
            note:note,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something went wrong please try again!'
        })
    }
};

const deleteNote = async (req, res) => {
    try {
        const { id: noteId } = req.params;

        const userId = req.userInfo.id;

        const note = await Note.findOneAndDelete({ _id: noteId, userId: userId });

        if (!note) {
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
        const userIdFromToken = req.userInfo.id;

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