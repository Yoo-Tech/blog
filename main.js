const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const path = require('path')

var dateFormat = require('dateformat');
var now = new Date();


const app = express()
const PORT = process.env.PORT || 4000;


// const connection_string = process.env.MONGO_URI

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(()=> console.log("MongosDB connection established..."))
.catch((error)=> console.error("MongoDB connection failded:", error.message))

app.use(express.static('public'))

app.use(express.static('uploads'));

//load assets
// app.use('/css', express.static(path.resolve(__dirname, "public/css")))
// app.use('/img', express.static(path.resolve(__dirname, "public/img")))
// app.use('/js', express.static(path.resolve(__dirname, "public/js")))



app.use(express.urlencoded({ extended: false}))
app.use(express.json());

app.use(
    session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
})
);

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

//

app.set('view engine', 'ejs')


app.use('', require('./routes/routes'))


app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
})