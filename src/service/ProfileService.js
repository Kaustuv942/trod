const User = require('../models/UserModel')
const Profile = require('../models/ProfileModel')
const logger = require('../logging/logger.js')


async function updateProfile(email, profile, res) {
   
    const updatedProfile = await Profile.findOneAndUpdate({profileId:profile.profileId}, profile,{
        new: true
      });
    console.log(updatedProfile)
    return updatedProfile;
    
}



async function getProfile(email) {

    const user = await User.findOne({email: email});
    logger.log.info("profile requested for user "+ user.profileId);
    const profile = await Profile.findOne({profileId: user.profileId})
    
    return {user ,profile};
}

async function getProfileByProfileId(profileId) {

    const profile =  await Profile.findOne({profileId})
    const user= await User.findOne({profileId});
    console.log({user,profile})
    return {user,profile};
   
}

module.exports = {
    updateProfile,
    getProfile,
    getProfileByProfileId
};