const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
    name:{
        type:string,
        require:true
    },
    email:{
        type:string,
        require:true,
        unique:true
    },
    password:{
        type:string,
        require:true
    },
    avatar :{
        type:string
    },date:{
        type:Date,
        default:Date.now
    }
})

module.export=user=mongoose('user','userSchema')