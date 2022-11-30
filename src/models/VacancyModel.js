const mongoose = require("mongoose");
const { Schema } = mongoose;

const VacancySchema = new Schema({
    vacancyId:{
        type:String,
        unique: true,
        required: true
    },
    position:{
        type:String
    },
    department:{
        type:String
    },
    college:{
        type:String
    },
    collegeId:{
        type:String
    },
    location:{
        type:String
    },
    minimumQualification:{
        type:String
    },
    minimumExperience:{
        type:String
    },
    compensation:{
        type:String
    },
    numberOfVacancies:{
        type:Number,
        default: 1,
    },
    dateCreated:{
        type:Date
    },
    applyLink:{
        type:String,
        default: "google.com"
    },
    status:{
        type: String,
        default:"open"
    },
    emailProfReplaced:{
        type:String,
        default: null
    }
});



const Vacancy =  mongoose.model("vacancy", VacancySchema);

module.exports = Vacancy;