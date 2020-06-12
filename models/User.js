const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullname: {
        type: String,
    },
    age: String,
});

module.exports = mongoose.model('user' , UserSchema);