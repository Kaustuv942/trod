const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfileSchema = new Schema({
    profileId: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
    },
    picture: {
        type: String,
    },
    addressId: {
        type: String,
    },
});

ProfileSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Profile =  mongoose.model("profile", ProfileSchema);

module.exports = Profile;