const mongoose = require('mongoose');

const {schema} = require('./secure/postvalidation');

const blogschema = new mongoose.Schema({
    title :{
        type :String,
        trim :true,
        minLength : 5,
        maxLength: 255,
        required : true,
    },
    body : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        default : "public",
        enum : ["private","public"]
    },
    thumbnail : {
        type : String,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    createdAt : {
        type: Date,
        default : Date.now,
    }

})

blogschema.index({ title : "text"})

blogschema.statics.postValidaion = function(body) {
    return schema.validate(body,{abortEarly : false});
}

module.exports = mongoose.model("Blog", blogschema);
