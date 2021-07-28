const express = require('express')
const router = express.Router();
const User = require('../models/users');
const multer = require('multer')
const fs = require('fs');

// image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
   
});
var upload = multer({
    storage: storage
}).single('image')

//homepage render and query db
router.get('/', (req, res)=>{
    // res.render('see_users', { title: "Home" })

    User.find()
    .then(users =>{
        res.render('index', { title: "Home" , users: users})
    })
})
// Read post
router.get('/read/:id', (req, res)=>{
    let id = req.params.id;
    User.findById(id, (err, users)=>{
        if(err){
            res.redirect('/')
        }else{
            if(users == null){
                res.redirect('/')
            }else{
                res.render('read', { title: 'Read Post', users: users})
            }
        }
    })
})


//add post
router.get('/add', (req, res)=>{
    res.render('add_posts', { title: "Add Posts"})
})
// insert post into the database
router.post('/add', upload, (req, res)=>{
    // new User--.User is the name of the model
    const user = new User({
        title: req.body.title,
        heading: req.body.heading,
        article: req.body.article,
        image: req.file.filename,
    })
    user.save((err)=>{
        if(err){
            res.json({ message: err.message, type:'danger'})
        }else{
            req.session.message = {
                type: 'success',
                message: "Post added successfully"
            };
            res.redirect('/action')
        }
    })
})

//action posts
router.get('/action', (req, res)=>{

    User.find()
    .then(users =>{
        res.render('action', { title: "Action" , users: users})
    })
})





//edit 
router.get('/edit/:id', (req, res)=>{
    let id = req.params.id;
    User.findById(id, (err, users)=>{
        if(err){
            res.redirect('/')
        }else{
            if(users == null){
                res.redirect('/action')
            }else{
                res.render('edit_posts', { title: 'Edit Post', users: users})
            }
        }
    })
})

//update user
router.post('/update/:id', upload, (req, res)=>{
    let id = req.params.id;
    let new_image = '';
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads' + req.body.old_image);
        }catch(err){
            console.log(err)
        }
    }else{
        new_image = req.body.old_image;
    }
    User.findByIdAndUpdate(id, {
        title: req.body.title,
        heading: req.body.heading,
        article: req.body.article,
        image: new_image,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'})
        }else{
            req.session.message = {
                type: 'success',
                message: 'Post updated successfully'
            };
            res.redirect('/action')
        }
    })
})

//delete

router.get('/delete/:id', (req, res)=>{
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result)=>{
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/' + result.image);
            }catch(err){
                console.log(err)
            }
        }
        if(err){
            res.json({ message: err.message})
        }else{
            req.session.message = {
                type: 'succes',
                message: "Post deleted successfully"
            }
            res.redirect('/action');
        }
    })
})

    // .catch(err => console.log(err)));

// exports.find = (req, res)=>{
//     if(req.query.id){
//         const id = req.query.id;
        
//         Userdb.findById(id)
//         .then(data =>{
//             if(!data){
//                 res.status(404).send({ message: `User not found`})
//             }else{
//                 res.send(data)
//             }
//         })
//         .catch(err =>{
//             res.status(500).send({ message: `Error retriving id ${id} information`})
//         })
//     }else{
//         Userdb.find()
//     .then(user =>{
//         res.send(user)
//     })
//     .catch(err =>{
//         res.status(500).send({ message : err.message || "Error occured while retriving data from database "})
//     })
//     }
    
// }


module.exports = router;