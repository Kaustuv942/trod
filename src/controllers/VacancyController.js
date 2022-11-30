const express = require('express')
const router = express.Router();
const vacancyServices = require('../service/VacancyService.js')
const Vacancy = require('../models/VacancyModel');
const masterDataService = require('../service/MasterDataService');
const userDataService = require('../service/UserService');
const logger = require('../logging/logger.js');

router.get('/',async (req,res)=>{

    try{
        const vacancies= await vacancyServices.getAll();
        res.json(vacancies)
    } catch(err)
    {   
        res.json(err)
    }
})

router.get('/subscribedvacancies',async (req,res,next)=>{
    try{
        const vacancies=await vacancyServices.getById(req.user);
        res.json(vacancies)
    } catch(err)
    {   
        res.json(err)
    }
  
})

module.exports = router;
