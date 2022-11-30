const express = require('express')
const router = express.Router();
const ProfileService = require('../service/ProfileService')
const Profile = require('../models/ProfileModel');
const Transformer = require('../models/TransformerModel');
const TransformerService = require('../service/TransformerDataService');


router.get('/all', async (req, res, next) => {
    try{
        const transfomers = await TransformerService.getAllTransformers(req.user)
        res.json(transfomers)
        
    }catch(err)
    {
        res.json(err)
    }
    
})

router.post('/add', async(req, res, next) => {
    
    try{
        const user=req.user.data;
        const transformer = await TransformerService.createTransformer(req.body, user)
        
        res.json(transformer)
        
    }catch(err)
    {
        res.json(err)
    }
    
})

router.post('/properties/add', async(req, res, next) => {
    
    try{
        const property = await TransformerService.addProperty(req.body)
        
        res.json(property)
        
    }catch(err)
    {
        res.json(err)
    }
    
})

router.get('/properties/:transformerId', async(req, res, next) => {
    
    try{
        const properties = await TransformerService.showAllProperty(req.params.transformerId)
        
        res.json(properties)
        
    }catch(err)
    {
        res.json(err)
    }
    
})


router.get('/:id', async (req, res, next) => {
  try{
    let transfomer =await ProfileService.getById(req.params.id);
    res.json(transfomer)

  }catch(err)
  {
    res.json(err)
  }

})

router.post('/mysubscriptions', async(req,res,next)=>{

  try{
    const user=req.user;
    console.log(req.user)
    const {colleges,department}=req.body;
    console.log(user)
    let subscription= await subscriptionServices.createSubscription(user,department,colleges)
    res.json(subscription)

  }catch(err)
  {
    res.json(err)
  }



})

router.get('/delete/:id',async (req,res)=>
{
  try{
        const subscription=subscriptionServices.deleteById(req.params.id)
        res.json("success");
  }catch(err)
  {
    res.json(err);
  }
})
router.get('/colleges', async(req,res)=>{
  let colleges= await subscriptionServices.getColleges();
  res.json(colleges);
})
router.get('/locations', async(req,res)=>{
  let locations= await subscriptionServices.getLocations();
  res.json(locations);
})

module.exports = router;