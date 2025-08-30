require('dotenv').config();
const express=require('express');
const cors=require('cors');
const connectToDb=require('./database/db');
const authRouter=require('./routes/auth-routes');
const noteRouter=require('./routes/note-routes');


connectToDb();

const app=express();
app.use(cors());
const PORT=process.env.PORT || 3000;

//Middlewares
app.use(express.json());

//routes
app.use('/api',authRouter);
app.use('/api/notes',noteRouter);
app.use('/',(req,res)=>{
    res.status(200).json({
        message:"Running successfully"
    });
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
