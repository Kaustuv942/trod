const express = require('express')
const router = express.Router();
const subscriptionServices = require('../service/SubscriptionService.js')
const Profile = require('../models/ProfileModel');
const Subscription = require('../models/SubscriptionModel.js');

router.get('/mysubscriptions', async (req, res, next) => {
  try{
    let subscriptions =await subscriptionServices.getById(req.user);
    res.json(subscriptions)

  }catch(err)
  {
    res.json(err)
  }

})

router.post('/filter', async(req, res, next) => {

  try{
    const {locations,colleges}=req.body;
    let departments= await subscriptionServices.getByFilters(locations,colleges)
    console.log(departments)
     res.json(departments)

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