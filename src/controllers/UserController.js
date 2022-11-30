const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const userServices = require('../service/UserService.js')
const profileServices = require('../service/ProfileService.js')
const logger = require('../logging/logger.js')



router.post('/register', (req, res, next) => {
    const {password} = req.body
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);
    try{
        userServices
            .register(req.body)
        res.json({success:true});
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

/*
Gets profile by authorization token. 
*/
router.get('/profile', async (req, res, next) => {
    logger.log.info("profile requested for user "+ req.user.data);
    try{
        const {user,profile} = await profileServices.getProfile(req.user.data)

     
        res.json({user,profile})
           
    }
    catch(err){
        next(err)
    }
})

// router.get('/getallteachers', async (req, res, next) => {

// })

router.post('/updateprofile',async  (req, res, next) => {
    logger.log.info("profile updated for user "+ req.user.data);
    try{
        const user = req.body.user
        const profile = req.body.profile
        console.log(user)
        const updatedUser = await userServices.updateUser(user);
        const updatedProfile = await profileServices.updateProfile(profile, user, res)
        res.json({updatedUser, updatedProfile})
    }
    catch(err){
        next(err);
    }
    

})

router.get('/:id', (req, res, next) => {
    userServices.getById(req.params.id).then(
        (user) => res.json(user)
    ).catch(err => next(err))
})


module.exports = router;