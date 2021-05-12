const express=require('express');
const Profile = require('../../models/profile');
const router=express.Router();
const auth=require('../../middleware/auth')
const User=require('../../models/User')
const request=require('request')
const config=require('config')

const { check,validationResult}=require('express-validator/check')
const profile = require('../../models/profile');
const { route } = require('./user');

// %route get api/profile /me
// %desc for getting current user profile 
// %access private
router.get('/me',auth,async(req,res)=>{
    try{
        // const profile=await Profile.findOne({user:req.user.id})
        // .populate('user',['name','avatar']);
        const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);  

        if (!profile){
            return res.status(400).json({msg:'there is no profile....'})

        }
        res.json(profile)

    }
    catch (err){
        console.error(err.message);
        res.status(500).send('server error.....!')


    }
})

// %route post api/profile 
// %desc create and update profile
// %access private

router.post('/',[auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]],async (req,res)=>{
    const errors=validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body

    // build profile object

    const profileFeilds={}
    profileFeilds.user=req.user.id;

    if (company) profileFeilds.company=company
    if (website) profileFeilds.website=website
    if (location) profileFeilds.location=location
    if (bio) profileFeilds.bio=bio
    if (status) profileFeilds.status=status
    if (githubusername) profileFeilds.githubusername=githubusername
    if (skills) {
        profileFeilds.skills=skills.split(',').map(skill=>skill.trim())
    }
    // console.log(profileFeilds.skills)
    // res.send('hello user')

    // socila handels

    profileFeilds.social={}

    if (youtube) profileFeilds.social.youtube=youtube;

    if (twitter) profileFeilds.social.twitter=twitter;
    if (facebook) profileFeilds.social.facebook=facebook;
    if (linkedin) profileFeilds.social.linkedin=linkedin;
    if (instagram) profileFeilds.social.instagram=instagram;

try{
    let profile=await Profile.findOne({user:req.user.id});

    if(profile){
        profile=await Profile.findOneAndUpdate(
            { user:user.req.id},
            {$set:profileFeilds},
            {new:true}
        );
        return res.json(profile)

    }
    // create profile
    profile=new Profile(profileFeilds)

    await profile.save();
    res.json(profile);
}
catch (err){
    console.error(err.message)
    res.status(500).send('server error....!')
}
})
// %route get api/profile
// %desc get all profile 
// %access public 

router.get('/',async(req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar'])
        res.json(profiles)
    } catch (err) {
        console.log(err.message)
        res.status(500).send('derver error')
    }
})

// %route get api/profile/user/:user_id 
// %desc get profile by user_id
// %access public 
// ////    -----

router.get('/user/:user_id',async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']) ;

        if(!profile){
            return res.status(400).json({msg:'there is no profile for this user'})
        }
        res.json(profile)
    } catch (err) {
        console.log(err.message)
        if (err.kind == ObjectId){
            return res.status(400).json({msg:'profile not found'})

        }
        res.status(500).send('server error')
    }
})

// ------------------

// delete a user from the db

router.delete('/',auth,async(req,res)=>{
    try {
        await Profile.findOneAndRemove({user:req.user.id})

        await User.findOneAndRemove({_id:req.user.id})
        res.json({msg:"user removed"})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
})

// upadte the current exprerience

router.put('/experience',[auth,
    [
        check('title','title is required').not().isEmpty(),
        check('company','company is required').not().isEmpty(),
        check('from','from date is required').not().isEmpty()
    ]],async(req,res)=>{
        const errors=validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }=req.body


        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user:req.user.id});
            profile.experience.unshift(newExp);
    
            await profile.save();
            res.json(profile);  
        } catch (err) {
            console.error(err.message)
            res.status(500).send('server error') 
        }
    })

// upadte education

router.put('/education',[auth,
    [
        check('school','title is required').not().isEmpty(),
        check('degree','company is required').not().isEmpty(),
        check('fieldofstudy','feild of study is required')
        .not().isEmpty(),
        check('from','date from you have been there').not().isEmpty()
    ]],async(req,res)=>{
        const errors=validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
            
        }
        // console.log('rohit');

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }=req.body


        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile =await Profile.findOne({user:req.user.id})
            profile.education.unshift(newEdu)

            await profile.save()
            res.json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('server error')

            
        }
    })

// delete education

router.delete('/education/:edu_id',auth,async(req,res)=>{
    try {
        const profile =await Profile.findOne({user:req.user.id})

        // get remove index
        const removeIndex= profile.education.map(item=>item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex,1)

        await profile.save()
        
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error.....')
        
    }
})

// get github repo
// public

router.get('github/:username',(req,res)=>{
    try {
        const options ={
            uri : `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}
        };
        request (options,(error,response,body)=>{
            if (error) console.error(error);

            if (response.statusCode!==200){
                res.status(404).json({msg:'no github profile'})

            }
            res.json(JSON.parse(body))
        })
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})

module.exports=router