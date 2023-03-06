const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertyNODEMCUSchema = new Schema({
    timeStamp: {
        type: Date,
        default: Date.now()
    },
    temp:{
        type: String,
    },
    humidity:{
        type: String,
    },
    vibx:{
        type: String,
    },
    viby:{
        type: String,
    },
    vibz:{
        type: String,
    }
});

propertyNODEMCUSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const propertyNODEMCU =  mongoose.model("propertyNODEMCU", propertyNODEMCUSchema);

module.exports = propertyNODEMCU;