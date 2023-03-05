const express = require('express')
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

router.post('/properties/add', async(req, res, next) => {
    
    try{
        const nodeMCUProperty = await NodeMCUDataService.addNodeMCUProperty(req.body)
        
        res.json(nodeMCUProperty)
        
    }catch(err)
    {
        res.json(err)
    }
    
})

module.exports = router;