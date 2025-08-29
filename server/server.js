require('dotenv').config();
const express=require('express');
const connectToDb=require('./database/db');
const authRouter=require('./routes/auth-routes');


connectToDb();

const app=express();
const PORT=process.env.PORT || 3000;

//Middlewares
app.use(express.json());

//routes
app.use('/api',authRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
