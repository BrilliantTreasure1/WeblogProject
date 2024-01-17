const mongoose = require('mongoose');

const Yup =require('yup');

const { schema } = require('../models/secure/userValidation');

const Userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "نام و نام خانوادگی الزامی می باشد"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});




    Userschema.statics.userValidation = function (body) {
        return schema.validate(body,{ abortEarly:false });
    }

const User = mongoose.model("User", Userschema);

module.exports = User;