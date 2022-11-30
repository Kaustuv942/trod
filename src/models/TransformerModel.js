const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransformerSchema = new Schema({
    transformerId: {
        type: String,
        required: true,
        unique: true,
    },
    transformerName: {
        type: String,
    },
    transformerOwner: {
        type: String, // email of the user:
    },
    Rating: {
        type: String,
    },
    Details: {
        type: String,
    }
});

TransformerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Transformer =  mongoose.model("transformer", TransformerSchema);

module.exports = Transformer;