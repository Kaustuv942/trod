const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
    
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role: {
        type: String,
    },
    collegeId: {
        type: String, //collegeId
    },
    collegeName:{
        type:String
    }
});

AdminSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        //do not reveal passwordHash
        delete returnedObject.password
    }
})

const Admin =  mongoose.model("admin", AdminSchema);

module.exports = Admin;