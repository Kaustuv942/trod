const mongoose = require("mongoose");
const { Schema } = mongoose;

const PropertiesSchema = new Schema({
    transformerId: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: String,
    },
    currentValue: {
        type: String, 
    },
    VoltageValue: {
        type: String,
    },
});

PropertiesSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Properties =  mongoose.model("property", PropertiesSchema);

module.exports = Properties;