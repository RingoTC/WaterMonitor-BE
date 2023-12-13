// models/userData.js

const mongoose = require('mongoose');
const {router} = require("express/lib/application");

const skillSchema = new mongoose.Schema({
    name: String,
    proficiency: String,
    certified: Boolean,
    certificationIssueDate: Date,
    certificationExpiryDate: Date,
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique:true},

    password: { type: String, required: true },
    position: {type: String},
    company: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    cellphone: {type: String},
    city: {type: String},
    country: {type: String},
    likes:{type:Array, default:[]},
    role: {
        type: String,
        enum: ["MANAGER", "ADMIN", "REPORTER"],
        default: "ADMIN" },

    about: {type: String},
    skills: [skillSchema],
    photo: {type: String},
    reminder:{type:String}
    },

    { collection: "users" });

const User = mongoose.model('Users', userSchema, 'users');

module.exports = User;
