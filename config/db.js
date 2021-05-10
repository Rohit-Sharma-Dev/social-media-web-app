const mongoose=require('mongoose')

const config=require('config');
const router = require('../routes/api/user');
const profile = require('../models/profile');

const db=config.get('mongoURI')

const connectDb= async()=>{
    try{
        await mongoose.connect (db,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });

        console.log("connected to mongodb......")
    }catch (err){
        console.log(err.message);
        // exit process with failure
        process.exit(1);
    }
}

// %route get api/profile 
// %desc get all all profile
// %access private


module.exports=connectDb