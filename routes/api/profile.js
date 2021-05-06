const express=require('express')

const router=express.Router();

// %route get/api/user
// %desc test route
// %access public route

router.get('/',(req,res)=>{
    res.send("your profile..... ")
})
module.exports=router;