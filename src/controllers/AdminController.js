const express = require('express')
const router = express.Router();
const userServices = require('../service/UserService.js')
const vacancyService = require('../service/VacancyService')
const adminService = require('../service/AdminService')
const logger = require('../logging/logger.js')
const Admin = require('../models/AdminModel');
const User = require('../models/UserModel.js');
const Mailer = require('../service/mailer')
const Constants = require('../Constants')
const bcrypt = require('bcryptjs')
const masterDataService = require('../service/MasterDataService')
const profileService = require('../service/ProfileService');
const College = require('../models/CollegeModel.js');
const Vacancy = require('../models/VacancyModel')

router.post('/login', async (req, res, next) => {

    const { email, password } = req.body;
    try {
        const user = await userServices.login({ email, password })
        const status = await Admin.findOne({ email: email })
        var isAdmin;
        var isSuperAdmin;
        const admin=status

        if(admin)
        {
            
            if(admin.role=="superadmin")
            {
                isSuperAdmin=true;
                isAdmin=false;
            }
            else
            {
                isAdmin=true;
                isSuperAdmin=false;
            }
            
        }
        else{
            isAdmin=false;
            isSuperAdmin=false;
        }
        if (user && status != null) {
            // User.findOneAndUpdate({email: email}, user);         
            res.status(200).json({...user,"isAdmin":isAdmin,"isSuperAdmin":isSuperAdmin});
        }
        else {
            res.json({ error: 'Email or password is incorrect' });
        }
    }
    catch (err) {
        next(err);
    }
})


router.post('/createvacancy', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        vacancyService.createVacancy(req.body)
            .then(() => {
                res.status(200).json({ "status": "success" });
            })
            .catch(err => next(err));
    }

})

router.post('/createteacher', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        const { password } = req.body
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(password, salt);
        userServices
            .register(req.body, res)
        
    }
})

router.get('/deletevacancy/:id', async (req, res) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        vacancyService.deleteVacancyById(req.params.id);
        res.json({ success: "true" });
    }
})

router.get('/getallteachers', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        const teachers = await userServices.getAllTeachers();
        res.json(teachers);
    }
})

router.get('/getmycollegeteachers', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        const adminCollege = req.collegeId;
        const teachers = await userServices.getCollegeTeachers(adminCollege);
        res.json(teachers)
    }
})

function compare( a, b ) {
    if ( parseInt(a.daysToRetire) < parseInt(b.daysToRetire) ){
      return -1;
    }
    if ( parseInt(a.daysToRetire > b.daysToRetire) ){
      return 1;
    }
    return 0;
  }

function addDays(date, days) {
var result = new Date(date);
result.setDate(result.getDate() + days);
return result;
}
router.get('/getvacancyfordays/:noOfDays', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        try {
            var masterData = await masterDataService.getMasterData()
            var allUsers = await userServices.getCollegeTeachers(req.collegeId)
            console.log(allUsers);
            var tmp = [];
            for (let i = 0; i < allUsers.length; i++) {
                const dob = allUsers[i].dob;
                logger.log.trace(allUsers[i]);
                logger.log.trace(dob);
    
                if (dob == null) continue;
                console.log(dob)
                console.log(masterData)
                console.log(allUsers[i])
                dob.setFullYear(dob.getFullYear() + masterData.RetirementAge);
                console.log(allUsers[i])
                
                logger.log.trace(dob)
                logger.log.trace()
                var todayDate = new Date();
                const days = (dob, todayDate) => {
                    let difference = dob.getTime() - todayDate.getTime();
                    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                    return TotalDays;
                }
                if(allUsers[i].isContractual == "true"){
                    dob.addDays(contractLength)
                }
                var diffDays = days(dob, todayDate);
                logger.log.trace(diffDays + " days to retirement");
                var noOfDays = req.params.noOfDays
                console.log(diffDays);
                console.log(noOfDays)
                if (diffDays <= noOfDays && (allUsers[i].exit == "none" || allUsers[i].exit == "pending")) {
                    // adjusting for dob
                    dob.setFullYear(dob.getFullYear() - masterData.RetirementAge); 
                    if(allUsers[i].isContractual == "true"){
                        dob.addDays(-contractLength)
                    }   
                    allUsers[i].exit = "pending";
                    allUsers[i].daysToRetire = diffDays;
                    tmp.push(allUsers[i]);
                }
    
            }
            // console.log(tmp);
            tmp.sort(compare);
            res.json(tmp);
        }
        catch (err) {
            next(err);
        }

    }
})

router.get('/profilebyprofileId/:profileId', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        var profile = await profileService.getProfileByProfileId(req.params.profileId)
        console.log(profile)
        res.json(profile)
    }
})

router.post('/mail/invite', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        const { vacancyId, profileIdList } = req.body;
        // send the url to all the profile email ids 
        const vacancy = await vacancyService.getVacancyById(vacancyId);
        if(vacancy){

            var mailingList = []
            for (let i = 0; i < profileIdList.length; i++) {
                var user = await userServices.getUserByProfileId(profileIdList[i]);
                mailingList.push(user.email);
            }
            for (let i = 0; i < mailingList.length; i++) {
                var params = {}
                params.to = mailingList[i];
                params.subject = Constants.MAIL_INVITE_SUBJECT
                params.text = Constants.MAIL_INVITE_TEXT + 'at ' + (vacancy.url != null ? vacancy.url : '');
                const sent = await Mailer.sendMail(params)
                
            }
        }
    }
    res.json({success:"True"})

})

router.get('/getongoingvacancies', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        try {
            const ongoingVac = await vacancyService.getOngoingVacancies(req.collegeId);
            res.json(ongoingVac)
        }
        catch (err) {
            next(err);
        }
    }
})

router.get('/getcompletedvacancies', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        try {
            const completedVac = await vacancyService.getCompletedVacancies(req.collegeId)
            res.json(completedVac)
        }
        catch (err) {
            next(err);
        }
    }
})

router.post('/markcompleted/:vacancyId', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        try {
            const vacancy = await vacancyService.markCompleted(req.params.vacancyId);
    
            res.json({ success: "true" })
        }
        catch (err) {
            next(err)
        }
    }
})

router.get('/getvacancydetail/:vacancyId', async(req, res, next) =>{
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        try {
            const vacancy = await Vacancy.findOne({vacancyId: req.params.vacancyId})
            console.log(vacancy)
            res.json(vacancy)
        }
        catch (err) {
            next(err);
        }
    }
})

router.get('/getsubscribedteachers/:vacancyId', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{

        try {
    
            const teachers = await adminService.getAllSubscribedTeachers(req.params.vacancyId);
            res.json(teachers)
        }
        catch (err) {
            next(err);
        }
    }
})

router.get('/dashboarddata', async (req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        
        const collegeId = req.collegeId
        const departments = await adminService.getDashboard(collegeId);
    
        res.json(departments);
    }



})

router.post('/microservice/mail', async (req, res, next) => {
    var params = {
        to: "",
        subject: "",
        text: ""
    }

    params.to = req.body.to;
    params.subject = req.body.subject;
    params.text = req.body.text;
    const success = await Mailer.sendMail(params)
    res.json({ success: "true" })

})
router.post('/createcollege', async (req, res) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{
        
        const college = await adminService.createCollege(req.body)
        res.json(college)
    }
})

router.get('/getmycollegedata', async (req, res) => {
    const collegeId = req.collegeId;

    const newcollege = await adminService.getMyCollegeData(collegeId)


    res.json(newcollege)

})

router.post('/rehire/:vacancyId', async(req, res, next) => {
    if(req.role != "admin"){
        res.status(403).json({"error":"unauthorized"});
    }
    else{  
        try{
            const contractLength = req.body.contractLength;
            const vacancy = await Vacancy.find({vacancyId:req.params.vacancyId})
            const emailProfReplaced =  vacancy[0].emailProfReplaced;
            console.log(emailProfReplaced)
            if(emailProfReplaced == null){
                res.status(400).json({error:"Retiring Prof doesn't exist"})
            }
            else if(vacancy.status == "completed"){
                res.status(400).json({error:"Vacancy is not open"})
            }
            else{

                logger.log.trace(contractLength)
                const user = await User.find({email:emailProfReplaced})
                user.isContractual = "true";
                user.contractLength = contractLength;


                // close this vacancy -> move to completed. 
                const vacancy = await vacancyService.markCompleted(req.params.vacancyId);
                const updatedUser = await userServices.updateUser(user)
                res.json({success:"true"})
                
            }

        }      
        catch(err){
            next(err)
        }
    }
    
    
})

// total capacity post req

// 
module.exports = router;