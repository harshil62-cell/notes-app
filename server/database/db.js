const mongoose=require('mongoose');

const connectToDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo Db connected successfully');
    } catch (error) {
        console.error(`Mongo connection failed ${error}`);
        process.exit(1);
    }
};

module.exports=connectToDb;