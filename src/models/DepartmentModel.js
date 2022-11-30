const mongoose = require("mongoose");
const { Schema } = mongoose;

const DepartmentSchema = new Schema({

    collegeId:{
        type:String
    },
    name:{
        type:String
    },
    capacity:{
        type:Number
    }

});



const Department =  mongoose.model("department", DepartmentSchema);

module.exports = Department