const express = require('express');
const propertyNODEMCU = require('../models/propertyNODEMCU');
const router = express.Router();
const NodeMCUDataService = require('../service/NodeMCUDataService');


router.get('/all', async (req, res, next) => {
    try{
        const NodeMCUData = await NodeMCUDataService.showAllNodeMCUProperties();
        res.json(NodeMCUData)
        
    }catch(err)
    {
        res.json(err)
    }
    
})

router.get('/properties/add/:temp/:humidity', async(req, res, next) => {
    const reqProperty = new propertyNODEMCU();
    reqProperty.temp = req.params.temp;
    reqProperty.humidity = req.params.humidity;
    console.log("/property/add/humidity/temp accessed");
    try{
        const nodeMCUProperty = await NodeMCUDataService.addNodeMCUProperty(reqProperty)
        
        res.json(nodeMCUProperty)
        
    }catch(err)
    {
        res.json(err)
    }
    
})

module.exports = router;