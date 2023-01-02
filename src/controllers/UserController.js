const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const userServices = require('../service/UserService.js')
const logger = require('../logging/logger.js')



router.post('/register', async (req, res, next) => {
    const {password} = req.body
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);
    try{
        const user = await userServices
            .register(req.body)
        res.json({success:true, user: user});
    }
    catch(err){
        res.status(400).json({success:false, msg:err});
    }
})

router.post('/login', (req, res, next) => {
    const { email, password} = req.body;
    userServices.login({email, password}).then(user => {
            if(user){                
                res.status(200).json(user);
            } 
            else{
                res.json({ error: 'Email or password is incorrect' });
            }
        }
    ).catch(err => next(err))
})

router.get('/:id', (req, res, next) => {
    userServices.getById(req.params.id).then(
        (user) => res.json(user)
    ).catch(err => next(err))
})


module.exports = router;