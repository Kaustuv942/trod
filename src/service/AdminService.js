const AdminData = require('../models/AdminModel');
const User = require('../models/UserModel')
const logger = require('../logging/logger.js')
const Subscription= require('../models/SubscriptionModel');
const Vacancy = require('../models/VacancyModel');
const Department=require('../models/DepartmentModel');
const College =require('../models/CollegeModel')
const masterDataService = require('../service/MasterDataService')
const userServices = require('../service/UserService.js')

function getAllAdminData() {
    return AdminData.find()
        .then((adminData) => {
            // logger.log.trace(masterData)
            return adminData          
        })
}

async function getAllSubscribedTeachers(vacancyId){
    //
    const newteachers=await User.find({exit:"none"});
    const teachers=newteachers.filter(checknotadmin)
    function checknotadmin(newteacher)
    {
        return (newteacher.email!="admin@nitdgp.com"&&newteacher.email!="superadmin@aicte.com"&&newteacher.email!="admin@nitk.com")
    }
    const vacancy= await Vacancy.findOne({vacancyId});
    const department=vacancy.department;
    const college=vacancy.college;

    const subscribedTeachers=[];

    for(let i=0;i<teachers.length;i++)
    {
        const subscriptions= await Subscription.find({profileId:teachers[i].profileId,department});
        for(let j=0;j<subscriptions.length;j++)
        {
           for(let k=0;k<subscriptions[j].colleges.length;k++)
           {
               if(subscriptions[j].colleges[k]==college)
               {
                   console.log(subscriptions[j].colleges[k])
                   subscribedTeachers.push(teachers[i]);
               }
           }
        }
     
    }
    return subscribedTeachers

}

async function getDashboard(collegeId){
    const departments=await Department.find({collegeId})//capacity
    const vacancies=await Vacancy.find({collegeId,status:"open"});//vacancy count
    const newteachers=await User.find({collegeId});
    const teachers=newteachers.filter(checknotadmin)
    function checknotadmin(newteacher)
    {
        return (newteacher.email!="admin@nitdgp.com"&&newteacher.email!="superadmin@aicte.com"&&newteacher.email!="admin@nitk.com")
    }
    const deps=[]
    console.log(vacancies)
    for(let i = 0; i < departments.length; i++){
        var vacCount = 0, teacherCount = 0;
        for(let j = 0; j < vacancies.length; j++){
            if(departments[i].name== vacancies[j].department){
                vacCount++;
            }
        }
        for(let j = 0; j < teachers.length; j++){
            if(departments[i].name == teachers[j].department){
                teacherCount++;
            }
        }
        var newdep={...departments[i]._doc}

        var depcount=departments[i].capacity
        newdep.vacancyCount = vacCount;
        newdep.teacherCount = depcount-vacCount;
        deps.push(newdep)
    }
    return deps;
}

async function createCollege(params)
{
    const college = await College.insertMany(params)
    return college
}

async function getMyCollegeData(collegeId)
{
    const college=await College.findOne({collegeId});
    const departments= await Department.find({collegeId});
    var newcollege;

    newcollege={"collegeId":collegeId,"collegeName":college.name,"departments":departments};
    
    return newcollege
}

async function getretiringteachersbydays(noOfDays)
{
    var masterData = await masterDataService.getMasterData()
    var allUsers = await userServices.getAllTeachersX();
    var tmp = [];
    for (let i = 0; i < allUsers.length; i++) {
        const dob = allUsers[i].dob;    
        if (dob == null) continue;
        dob.setFullYear(dob.getFullYear() + masterData.RetirementAge);
        var todayDate = new Date();
        const days = (dob, todayDate) => {
            let difference = dob.getTime() - todayDate.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
        var diffDays = days(dob, todayDate);
        if (diffDays <= noOfDays && (allUsers[i].exit == "none" || allUsers[i].exit == "pending")) {
            // adjusting for dob
            dob.setFullYear(dob.getFullYear() - masterData.RetirementAge); 
            
            allUsers[i].exit = "pending";
            allUsers[i].daysToRetire = diffDays;
            tmp.push(allUsers[i]);
        }

    }
    return tmp;
}
async function getretiringteachersbydaysx(noOfDays)
{
    var masterData = await masterDataService.getMasterData()
    var allUsers = await userServices.getAllTeachersX();
    var tmp = [];
    for (let i = 0; i < allUsers.length; i++) {
        const dob = allUsers[i].dob;    
        if (dob == null) continue;
        dob.setFullYear(dob.getFullYear() + masterData.RetirementAge);
        var todayDate = new Date();
        const days = (dob, todayDate) => {
            let difference = dob.getTime() - todayDate.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
        var diffDays = days(dob, todayDate);
        if (diffDays <= noOfDays && (allUsers[i].exit == "none" || allUsers[i].exit == "pending")) {
            // adjusting for dob
            dob.setFullYear(dob.getFullYear() - masterData.RetirementAge); 
            
            allUsers[i].exit = "pending";
            allUsers[i].daysToRetire = diffDays;
            tmp.push(allUsers[i]);
        }
        if (diffDays <= noOfDays && (allUsers[i].exit == "exit" )) {
            // adjusting for dob
            dob.setFullYear(dob.getFullYear() - masterData.RetirementAge); 
            
            allUsers[i].daysToRetire = diffDays;
            tmp.push(allUsers[i]);
        }

    }
    return tmp;
}


module.exports = {
    getAllAdminData,
    getAllSubscribedTeachers,
    getDashboard,
    createCollege,
    getMyCollegeData,
    getretiringteachersbydays,
    getretiringteachersbydaysx
};