const Transformer = require('../models/TransformerModel')
const Properties = require('../models/PropertiesModel')
const logger = require('../logging/logger.js')
const { v4: uuidv4 } = require('uuid');



async function getById(id) {
   
    const transformer = await Transformer.findOne({transformerId:id});
    console.log(transformer)
    return transformer;
    
}

async function createTransformer(params, ownerEmail) {
    const transformer = new Transformer(params);
    transformer.transformerOwner = ownerEmail;
    transformer.transformerId = uuidv4();
    transformer.save();
    return transformer
}

async function getAllTransformers(ownerEmail) {
    const transformers = await Transformer.find({transformerOwner: ownerEmail})
    console.log(transformers)
    return transformers
}

async function addProperty(params){
    const property = new Properties(params)
    property.save()
    return property;

}

async function showAllProperty(transformerId) {
    const allProperties = Properties.find({transformerId: transformerId})
    return allProperties
}


async function getProfile(email) {

    const user = await User.findOne({email: email});
    logger.log.info("profile requested for user "+ user.profileId);
    const profile = await Profile.findOne({profileId: user.profileId})
    
    return {user ,profile};
}

async function getProfileByProfileId(profileId) {

    const profile = await Profile.findOne({profileId})
    const user= await User.findOne({profileId});
    console.log({user,profile})
    return {user,profile};
   
}

module.exports = {
    getById,
    getProfile,
    getProfileByProfileId,
    createTransformer,
    getAllTransformers,
    addProperty,
    showAllProperty
};