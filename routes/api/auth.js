const express=require('express')

const router=express.Router();

const auth=require('../../middleware/auth')

const User =require('../../models/User')

// for another http request
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const config=require('config')
const { check,validationResult}=require('express-validator') 

// %route get/api/user
// %desc test route
// %access public route

router.get('/',auth,async(req,res)=>{
    try{
        const user=await (User.findById(req.user.id)).select('-password')
        res.send(user);
    }
    catch (err){
        console.err(err.message);
        res.status(500).send('server error')
    }
    res.send("authanticate yourself here.... ")
})


router.post('/',[
    
    check('email','Email is required').isEmail(),
    check(
      "password",
      "Password is required"
      ).exists()
    ],
    async(req,res)=>{
// console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 
    const {email,password}=req.body;
    try{
        let user =await User.findOne({email})
        if (user){
            return res
            .status(400)
            .json({errors:[{msg:'invalid'}]})
  }
  
  const isMatch=await bcrypt.comapare(password,user.password)
  if(!isMatch){
    return res
    .status(400)
    .json({errors:[{msg:'invalid'}]})

  }

  const payload={
    user:{
      id:user.id
    }
    };

  jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},(err,token)=>{
    if (err) throw err;
    res.send({token})

  })



// res.send("hello user you are succesfully registered with us ")
}
catch(err){ 
  console.error(err);
  res.status(500).send('server error')
}
})

module.exports=router;