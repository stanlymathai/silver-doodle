var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('Users', userSchema);