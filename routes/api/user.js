const express=require('express')
const router=express.Router();
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const config=require('config')
const { check,validationResult}=require('express-validator')
const User=require('../../models/User') 

// %route post/api/users
// %desc register user
// %access public 


router.post('/',[
      check('name','Name is required').not().isEmpty(),
      check('email','Email is required').isEmail(),
      check(
        "password",
        "Password is required"
        ).isLength({min:6})
  ],
  async(req,res)=>{
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 
  const {name,email,password}=req.body;
  try{
    let user =await User.findOne({email})
    if (user){
      return res
      .status(400)
      .json({errors:[{msg:'user already exist....'}]})
    }
    const avatar =gravatar.url(email,{
      s:'200',
      r:'pg',
      d:'mm'
    });
    
    user=new User({
      name,
      email,
      avatar,
      password
    });

    const salt= await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt)
    await user.save();

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