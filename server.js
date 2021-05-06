const express=require('express')
const connectDb=require('./config/db.js');
const app =express()
const port = 3000

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

app.listen(port,()=>`your server is started on ${port}`)


// mongodb+srv://rohitk7065:<password>@cluster0.pekle.mongodb.net/myFirstDatabase?retryWrites=true&w=majority