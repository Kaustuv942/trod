const mongoose = require("mongoose");
const { Schema } = mongoose;

const UnitsSchema = new Schema({
    fieldName: {
        type: String,
    },
    fieldUnit: {
        type: String,
    },
});

UnitsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        //do not reveal passwordHash
        delete returnedObject.password
    }
})

const Unit = mongoose.model("unit", UnitsSchema);

module.exports = Unit;