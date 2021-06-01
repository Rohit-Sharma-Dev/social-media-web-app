const express=require('express')
const connectDb=require('./config/db.js');
const cors=require('cors')

const app =express()
app.use(cors())


// connect database
connectDb();

// middleware

app.use(express.json({extended:false }))

// general calling of a server
app.get('/',(req,res)=>res.send("api runing........"))

// call other router

app.use('/api/user',require('./routes/api/user'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/post',require('./routes/api/post'))


const port = 8000
app.listen(port,()=>console.log(`your server is started on ${port}`))

