const express=require('express')

const router=express.Router();
const { check,validationresult}=require('express-validator/check')

// %route get/api/user
// %desc test route
// %access public route

router.post('/',
[
    check('name','Name is required').not().isEmpty()
    ,check('email',"Email is required").isEmail(),
    check('password',"Password is required").isLength({min:6})
],

(req,res)=>{
    // console.lod(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("heelloo user....welcome to this social media app..... ")
})

module.exports=router;