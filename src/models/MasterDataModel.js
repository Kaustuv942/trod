const mongoose = require("mongoose");
const { Schema } = mongoose;

const MasterDataSchema = new Schema({
    RetirementAge:{
        type:Number
    },
    AlertCountDownDay:{
        type:Number
    }
});



const MasterData =  mongoose.model("masterData", MasterDataSchema);

module.exports = MasterData;