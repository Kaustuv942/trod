const Subscription = require('../models/SubscriptionModel');
const College =require('../models/CollegeModel.js');
const { loggers } = require('winston');
const User = require('../models/UserModel')
const { v4: uuidv4 } = require('uuid');
const res = require('express/lib/response');
async function getById(user) {
  const profile=await User.find({email:user.data});
  const profileId=profile[0].profileId
  console.log(profile)
   const subscriptions = await Subscription.find({profileId});
    return subscriptions

}

async function getByFilters(locations,colleges){
  
    const possibleColleges =await College.find({ $or:[ {"location":{"$in":locations}},{"name":{"$in":colleges}}]})
 
    const allDepartmentsSet= new Set();

    possibleColleges.forEach((clg)=>{clg.departments.forEach(allDepartmentsSet.add,allDepartmentsSet)});
    var allDepartments = [...allDepartmentsSet];

      var departments= new Map()
    for(let i=0;i<allDepartments.length;i++)
    { 
      let temp=[]
        for(let j=0;j<possibleColleges.length;j++)
        {
          if(possibleColleges[j].departments.includes(allDepartments[i]))
          {
            temp.push(possibleColleges[j].name)
          }
        }
        departments.set(allDepartments[i],temp)
    }

    var deps=[]

    departments.forEach(function(val,key)
    {
        deps.push({department:key,colleges:val})
    });
   // console.log(departments);
    return deps
} 
async function createSubscription(user,department,colleges)
{
  console.log(user)
  const profile=await User.find({email:user.data});
  const profileId=profile[0].profileId
  const subscriptionId=uuidv4();

  const subscription = await Subscription.insertMany({subscriptionId,profileId,department,colleges});
  return subscription;
}

async function deleteById(subscriptionId)
{
  const subscription =await Subscription.deleteOne({subscriptionId});
  return (subscription);
}

async function getColleges()
{
  const clgs = await College.find();
  const colleges= clgs.map((clg)=>clg.name);
  return colleges
}

async function getLocations()
{
  const colleges = await College.find();
  const locs= new Set()

  colleges.forEach((clg)=>{
    locs.add(clg.location)
  })
  
  const locations =[...locs]
  return locations
}



module.exports = {
  getById,
  getByFilters,
  createSubscription,
  getColleges,
  getLocations,
  deleteById
};