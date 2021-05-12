const express=require('express')
const router=express.Router();
const {check,validationResult}=require('express-validator/check');
const auth=require('../../middleware/auth')
const Post=require('../../models/post')
const Profile=require('../../models/profile')
const User=require('../../models/User')

// %route post api/post
// %desc create post
// %access private

router.post('/',[auth,[
    check('text','text is required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try {
        const user =await User.findById(req.user.id).select('-password')

    const newPost=new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user.id
    })

    const post=await newPost.save()
    res.json(post)

        
    } catch (err) {
        console.error(err.message)
        res.status(500).json('server error')
        
    }

})

// get all post
router.get('/',auth,async(req,res)=>{
    try {
        const posts=await Post.find().sort({date:-1})
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
        
    }
})

// get post by id
router.get('/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if (!post){
            return res.status(404).json({msg:'post not found'})
        }
        res.json(post)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId'){
            return res.status(404).json({msg:'post not found'})
        }
        res.status(500).send('server error')
        
    }
})

// delete a post

router.delete('/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)

        if (!post){
            return res.status(404).json({msg:'post not found'})
        }

        if (post.user.toString()!== req.user.id){
            return res.status(401).json({msg:'user is not authorized'})
        }
        await post.remove();
        res.json({msg:'post removed'})
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId'){
            return res.status(404).json({msg:'post not found'})
        }
        res.status(500).send('server error')
        
    }
})

// like a post

router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post =await Post.findById(req.params.id)

        if(post.likes.filter(like=>
            likes.user.toString()===req.user.id
        ).length>0){
        return res.json(400).json({msg:'post already liked'})
        }
    post.likes.unshift({user:req.user.id})
    await post.save()
    res.json(post.likes)
}
    catch (err) {
        console.error(err.message)
        res.status(500).send('server error......')
        
    }
})

// unlike a post 

router.put('/unlike/:id',auth,async(req,res)=>{
    try {
        const post =await Post.findById(req.params.id)

        if(post.likes.filter(like=>
            like.user.toString()===req.user.id
        ).length===0){
        return res.status(400).json({msg:'post has not been liked'})
        }
    
        const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
        
        post.likes.splice(removeIndex,1)

    await post.save()
    res.json(post.likes)
}
    catch (err) {
        console.error(err.message)
        res.status(500).send('server error......')
        
    }
})


//  post a comment


router.post('/comments/:id',[auth,
    [check('text','text is required').not().isEmpty()
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try {
        const user =await User.findById(req.user.id).select('-password')
        const post=await Post.findById(req.params.id)
        const newcomment={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        }

        post.Comments.unshift(newcomment)

        await post.save()
        res.json(post.Comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).json('server error')      
    }
})

// delete a comment

router.delete('/comments/:id/:comment_id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)

        // get the comment
        const comment=post.Comments.find(comment=>
            comment.id === req.params.comment_id)

        // coment exist or not
        if(!comment){
            return res.status(400).json({msg:'comment does not exist'})
        }

        // check user exist or not

        if(comment.user.toString()!==req.user.id){
            return res.status(401).json({msg:'user not authorized'})
        }

        const removeIndex = post.Comments.map(comment=>comment.user.toString()).indexOf(req.user.id)
        
        post.Comments.splice(removeIndex,1)

        await post.save()
        res.json(post.Comments)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})
module.exports=router;