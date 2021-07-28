
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    heading:{
        type: String,
        required: true,
        
    },
    article:{
        type: String,
        required: true,
        
    },
    image:{
        type: String,
        required: true,
    },
    created:{
        type: Date,
        required: true,
        default: Date.now,
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User

// module.exports = mongoose.model('User'. userSchema)