const Transformer = require('../models/TransformerModel')
const NodeMCUProperties = require('../models/propertyNODEMCU')
const logger = require('../logging/logger.js')
const { v4: uuidv4 } = require('uuid');



async function addNodeMCUProperty(params){
    const nodeMCUProperties = new NodeMCUProperties(params)
    nodeMCUProperties.save()
    return nodeMCUProperties;

}

async function showAllNodeMCUProperties() {
    const allProperties = NodeMCUProperties.find();
    return allProperties;
}

module.exports = {
    addNodeMCUProperty,
    showAllNodeMCUProperties
};