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
    topOilTemperatureC:{
        type: String,
    },
    bottomOilTemperatureC:{
        type: String,
    },
    phaseCurR:{
        type: String,
    },
    phaseCurY:{
        type: String,
    },
    phaseCurB:{
        type: String,
    },
    phaseVolR:{
        type: String,
    },
    phaseVolY:{
        type: String,
    },
    phaseVolB:{
        type: String,
    },
    neutralCur:{
        type: String,
    },
    volEarthToNeutral:{
        type: String,
    },
    humidity:{
        type: String,
    },
    powerFactor:{
        type: String,
    }

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