const MasterData = require('../models/MasterDataModel');
const logger = require('../logging/logger.js')


function getMasterData() {
    return MasterData.findOne()
        .then((masterData) => {
            // logger.log.trace(masterData)
            return masterData          
        })
}

module.exports = {
    getMasterData
};