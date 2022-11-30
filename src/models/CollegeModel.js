const mongoose = require("mongoose");
const { Schema } = mongoose;

const CollegeSchema = new Schema({

    collegeId:{
        type:String
    },
    name:{
        type:String
    },
    location:{
        type:String
    },
    departments:{
        type:[{type:String}]
    },


});



const College =  mongoose.model("college", CollegeSchema);

module.exports = College