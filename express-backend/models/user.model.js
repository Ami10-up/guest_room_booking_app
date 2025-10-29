// express-backend/models/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

module.exports = User;